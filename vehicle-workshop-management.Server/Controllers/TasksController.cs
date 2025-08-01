using Mapster;
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
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
        {
            var tasks = await _context.Tasks
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.Project)
                .Include(t => t.TaskLines)
                .AsNoTracking()
                .ToListAsync();

            return tasks.Adapt<List<TaskDto>>();
        }

        // GET: api/Tasks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.Project)
                .Include(t => t.TaskLines)
                    .ThenInclude(tl => tl.Employee)
                .Include(t => t.TaskLines)
                    .ThenInclude(tl => tl.Inventory)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.TaskId == id);

            if (task == null)
            {
                return NotFound();
            }

            return task.Adapt<TaskDto>();
        }

        // POST: api/Tasks
        [HttpPost]
        public async Task<ActionResult<TaskDto>> PostTask(CreateTaskDto taskDto)
        {
            var task = taskDto.Adapt<AppTask>();

            // Set default values
            task.ReceivedAt ??= DateTime.UtcNow;
            task.Status ??= "Pending";

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            // Reload with relationships for complete DTO
            var createdTask = await _context.Tasks
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.TaskId == task.TaskId);

            return CreatedAtAction(nameof(GetTask), new { id = task.TaskId }, createdTask.Adapt<TaskDto>());
        }

        // PUT: api/Tasks/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, UpdateTaskDto taskDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            // Update completion timestamp if status changed to "Completed"
            if (task.Status != "Completed" && taskDto.Status == "Completed")
            {
                task.EndTime = DateTime.UtcNow;
            }

            taskDto.Adapt(task);
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
                throw;
            }

            return NoContent();
        }

        // PATCH: api/Tasks/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, UpdateTaskStatusDto statusDto)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            task.Status = statusDto.Status;

            // Update timestamps based on status changes
            if (statusDto.Status == "In Progress" && task.StartTime == null)
            {
                task.StartTime = DateTime.UtcNow;
            }
            else if (statusDto.Status == "Completed")
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
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByProject(int projectId)
        {
            var tasks = await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.TaskLines)
                .AsNoTracking()
                .ToListAsync();

            return tasks.Adapt<List<TaskDto>>();
        }

        // GET: api/Tasks/byStatus?status=Completed
        [HttpGet("byStatus")]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByStatus([FromQuery] string status)
        {
            var tasks = await _context.Tasks
                .Where(t => t.Status == status)
                .Include(t => t.Car)
                .Include(t => t.Customer)
                .Include(t => t.Project)
                .Include(t => t.TaskLines)
                .AsNoTracking()
                .ToListAsync();

            return tasks.Adapt<List<TaskDto>>();
        }

        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.TaskId == id);
        }
    }
}