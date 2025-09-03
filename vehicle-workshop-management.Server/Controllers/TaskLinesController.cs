using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskLinesController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public TaskLinesController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/TaskLines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskLineDto>>> GetTaskLines()
        {
            var taskLines = await _context.TaskLines
                .Include(t => t.Employee)
                .Include(t => t.Inventory)
                .Include(t => t.Task)
                .AsNoTracking()
                .ToListAsync();
            return taskLines.Adapt<List<TaskLineDto>>();
        }

        // GET: api/TaskLines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskLineDto>> GetTaskLine(int id)
        {
            var taskLine = await _context.TaskLines
                .Include(t => t.Employee)
                .Include(t => t.Inventory)
                .Include(t => t.Task)
                .FirstOrDefaultAsync(t => t.TaskLineId == id);

            if (taskLine == null)
            {
                return NotFound();
            }

            return taskLine.Adapt<TaskLineDto>();
        }

        [HttpPost("tasks/{taskId}/Tasklines")]
        public async Task<ActionResult<TaskLineDto>> AddTaskLine(int taskId, [FromBody] CreateTaskLineDto createDto)
        {
            if (!await _context.Tasks.AnyAsync(t => t.TaskId == taskId))
            {
                return NotFound("Task not found");
            }

            if (!await _context.Employees.AnyAsync(e => e.EmployeeId == createDto.EmployeeId))
            {
                return BadRequest("Invalid EmployeeId");
            }

            // Map TaskLine
            var taskLine = createDto.Adapt<TaskLine>();
            taskLine.TaskId = taskId;
            taskLine.LineTotal = (createDto.Quantity ?? 0) * (createDto.UnitPrice ?? 0);

            _context.TaskLines.Add(taskLine);
            await _context.SaveChangesAsync();

            var task = await _context.Tasks
                .Include(t => t.Customer)
                .FirstOrDefaultAsync(t => t.TaskId == taskId);

            var invoice = await _context.Invoices
                .Include(i => i.InvoiceLines)
                .FirstOrDefaultAsync(i => i.CustomerId == task.CustomerId && i.Status == "Pending");

            if (invoice == null)
            {
                invoice = new Invoice
                {
                    CustomerId = task.CustomerId,
                    DateIssued = DateOnly.FromDateTime(DateTime.UtcNow),
                    DueDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
                    Status = "Pending",
                    Notes = $"Auto-generated for Task #{task.TaskId}",
                    TotalAmount = 0
                };
                _context.Invoices.Add(invoice);
                await _context.SaveChangesAsync();
            }

            // 🔹 Create related InvoiceLine
            var invoiceLine = new InvoiceLine
            {
                InvoiceId = invoice.InvoiceId,
                TaskLineId = taskLine.TaskLineId,
                InventoryId = taskLine.InventoryId,
                Description = taskLine.Description,
                Quantity = taskLine.Quantity,
                UnitPrice = taskLine.UnitPrice,
                LineTotal = taskLine.LineTotal
            };

            _context.InvoiceLines.Add(invoiceLine);

            invoice.TotalAmount = invoice.InvoiceLines.Sum(il => il.LineTotal) + taskLine.LineTotal;
            _context.Entry(invoice).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            // Reload TaskLine with relationships
            var createdTaskLine = await _context.TaskLines
                .Include(tl => tl.Employee)
                .Include(tl => tl.Inventory)
                .FirstOrDefaultAsync(tl => tl.TaskLineId == taskLine.TaskLineId);

            return CreatedAtAction(
                nameof(GetTaskLine),
                new { id = taskLine.TaskLineId },
                createdTaskLine.Adapt<TaskLineDto>());
        }



        // PUT: api/TaskLines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskLine(int id, UpdateTaskLineDto tasklineDto)
        {
            var taskLine = await _context.TaskLines.FindAsync(id);
            if (taskLine == null)
            {
                return NotFound("TaskLine not found");
            }

            // Update TaskLine values
            tasklineDto.LineTotal = (tasklineDto.Quantity ?? 0) * (tasklineDto.UnitPrice ?? 0);
            tasklineDto.Adapt(taskLine);

            _context.Entry(taskLine).State = EntityState.Modified;

            var invoiceLine = await _context.InvoiceLines.FirstOrDefaultAsync(il => il.TaskLineId == id);
            if (invoiceLine != null)
            {
                invoiceLine.Description = taskLine.Description;
                invoiceLine.Quantity = taskLine.Quantity;
                invoiceLine.UnitPrice = taskLine.UnitPrice;
                invoiceLine.LineTotal = taskLine.LineTotal;

                _context.Entry(invoiceLine).State = EntityState.Modified;

                var invoice = await _context.Invoices
                    .Include(i => i.InvoiceLines)
                    .FirstOrDefaultAsync(i => i.InvoiceId == invoiceLine.InvoiceId);

                if (invoice != null)
                {
                    invoice.TotalAmount = invoice.InvoiceLines.Sum(il => il.LineTotal);
                    _context.Entry(invoice).State = EntityState.Modified;
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }


        // DELETE: api/TaskLines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskLine(int id)
        {
            var taskLine = await _context.TaskLines.FindAsync(id);
            if (taskLine == null)
            {
                return NotFound("TaskLine not found");
            }

            var invoiceLine = await _context.InvoiceLines.FirstOrDefaultAsync(il => il.TaskLineId == id);
            int? invoiceId = invoiceLine?.InvoiceId;

            if (invoiceLine != null)
            {
                _context.InvoiceLines.Remove(invoiceLine);
            }

            _context.TaskLines.Remove(taskLine);
            await _context.SaveChangesAsync();

            if (invoiceId.HasValue)
            {
                var invoice = await _context.Invoices
                    .Include(i => i.InvoiceLines)
                    .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId.Value);

                if (invoice != null)
                {
                    invoice.TotalAmount = invoice.InvoiceLines.Sum(il => il.LineTotal);
                    _context.Entry(invoice).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                }
            }

            return NoContent();
        }

        // GET: api/TaskLines/ByTask/5
        [HttpGet("ByTask/{taskId}")]
        public async Task<ActionResult<IEnumerable<TaskLineDto>>> GetTaskLinesByTask(int taskId)
        {
            var taskline = await _context.TaskLines
                .Where(t => t.TaskId == taskId)
                .Include(t => t.Employee)
                .Include(t => t.Inventory)
                .ToListAsync();
            return taskline.Adapt<List<TaskLineDto>>();
        }

        private bool TaskLineExists(int id)
        {
            return _context.TaskLines.Any(e => e.TaskLineId == id);
        }
    }
}