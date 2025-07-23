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
        public async Task<ActionResult<IEnumerable<TaskLine>>> GetTaskLines()
        {
            return await _context.TaskLines
                .Include(t => t.Employee)
                .Include(t => t.Inventory)
                .Include(t => t.Task)
                .ToListAsync();
        }

        // GET: api/TaskLines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskLine>> GetTaskLine(int id)
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

            return taskLine;
        }

        // POST: api/TaskLines
        [HttpPost]
        public async Task<ActionResult<TaskLine>> PostTaskLine(TaskLine taskLine)
        {
            // Calculate line total if not provided
            if (taskLine.LineTotal == 0 && taskLine.Quantity > 0 && taskLine.UnitPrice > 0)
            {
                taskLine.LineTotal = taskLine.Quantity * taskLine.UnitPrice;
            }

            _context.TaskLines.Add(taskLine);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTaskLine), new { id = taskLine.TaskLineId }, taskLine);
        }

        // PUT: api/TaskLines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTaskLine(int id, TaskLine taskLine)
        {
            if (id != taskLine.TaskLineId)
            {
                return BadRequest();
            }

            // Recalculate line total if quantity or unit price changes
            taskLine.LineTotal = taskLine.Quantity * taskLine.UnitPrice;

            _context.Entry(taskLine).State = EntityState.Modified;

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
        public async Task<ActionResult<IEnumerable<TaskLine>>> GetTaskLinesByTask(int taskId)
        {
            return await _context.TaskLines
                .Where(t => t.TaskId == taskId)
                .Include(t => t.Employee)
                .Include(t => t.Inventory)
                .ToListAsync();
        }

        private bool TaskLineExists(int id)
        {
            return _context.TaskLines.Any(e => e.TaskLineId == id);
        }
    }
}