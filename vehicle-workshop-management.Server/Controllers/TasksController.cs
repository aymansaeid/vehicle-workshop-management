using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;
using AppTask = vehicle_workshop_management.Server.Models.Task;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public TasksController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/Tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppTask>>> GetTasks()
        {
            return await _context.Tasks
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.Project)
                .ToListAsync();
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppTask>> GetTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (task == null)
            {
                return NotFound();
            }

            return task;
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<AppTask>> PostTask(AppTask task)
        {
            // Set default timestamps if not provided
            if (task.ReceivedAt == default)
            {
                task.ReceivedAt = DateTime.UtcNow;
            }

            if (task.Status == null)
            {
                task.Status = "Pending"; // Default status
            }

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, task);
        }

        // PUT: api/Tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, AppTask task)
        {
            if (id != task.TaskId)
            {
                return BadRequest();
            }

            // Update completion timestamp if status changed to "Completed"
            var existingTask = await _context.Tasks.FindAsync(id);
            if (existingTask?.Status != "Completed" && task.Status == "Completed")
            {
                task.EndTime = DateTime.UtcNow;
            }

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
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

        // PATCH: api/Tasks/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] string status)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            task.Status = status;

            // Update timestamps based on status changes
            if (status == "In Progress" && task.StartTime == default)
            {
                task.StartTime = DateTime.UtcNow;
            }
            else if (status == "Completed")
            {
                task.EndTime = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Tasks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Tasks/byProject/5
        [HttpGet("byProject/{projectId}")]
        public async Task<ActionResult<IEnumerable<AppTask>>> GetTasksByProject(int projectId)
        {
            return await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .ToListAsync();
        }

        // GET: api/Tasks/byStatus?status=Completed
        [HttpGet("byStatus")]
        public async Task<ActionResult<IEnumerable<AppTask>>> GetTasksByStatus([FromQuery] string status)
        {
            return await _context.Tasks
                .Where(t => t.Status == status)
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.Project)
                .ToListAsync();
        }

        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.TaskId == id);
        }
    }
}