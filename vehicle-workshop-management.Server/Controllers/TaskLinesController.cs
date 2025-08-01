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
        public async Task<ActionResult<TaskLineDto>> AddTaskLine(int taskId,[FromBody] CreateTaskLineDto createDto)
        {
           
            if (!await _context.Tasks.AnyAsync(t => t.TaskId == taskId))
            {
                return NotFound("Task not found");
            }
        
            if (!await _context.Employees.AnyAsync(e => e.EmployeeId == createDto.EmployeeId))
            {
                return BadRequest("Invalid EmployeeId");
            }

            /*
            if (!await _context.Inventory.AnyAsync(i => i.InventoryId == createDto.InventoryId))
            {
                return BadRequest("Invalid InventoryId");
            }
            */
           
            var taskLine = createDto.Adapt<TaskLine>();
            taskLine.TaskId = taskId; // Ensure taskId from route is used

            _context.TaskLines.Add(taskLine);
            await _context.SaveChangesAsync();

            // Reload with relationships
            var createdTaskLine = await _context.TaskLines
                .Include(tl => tl.Employee)
                .Include(tl => tl.Inventory)
                .FirstOrDefaultAsync(tl => tl.TaskLineId == taskLine.TaskLineId);

            return CreatedAtAction(nameof(GetTaskLine),new { id = taskLine.TaskLineId },createdTaskLine.Adapt<TaskLineDto>());
        }

        

        // PUT: api/TaskLines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskLine(int id, UpdateTaskLineDto tasklineDto)
        {
            var taskline = await _context.Tasks.FindAsync(id);

            if (taskline == null)
            {
                return BadRequest();
            }

            
            tasklineDto.LineTotal = tasklineDto.Quantity * tasklineDto.UnitPrice;
            tasklineDto.Adapt(taskline);
            _context.Entry(taskline).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskLineExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/TaskLines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskLine(int id)
        {
            var taskLine = await _context.TaskLines.FindAsync(id);
            if (taskLine == null)
            {
                return NotFound();
            }

            _context.TaskLines.Remove(taskLine);
            await _context.SaveChangesAsync();

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