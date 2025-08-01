using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly DBCONTEXT _context;

    public ProjectsController(DBCONTEXT context)
    {
        _context = context;
    }

    // GET: api/Projects
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
    {
        var projects = await _context.Projects
            .Include(p => p.Customer)
            .Include(p => p.Tasks)
            .ToListAsync();
        var res = projects.Adapt<List<ProjectDto>>();
        return Ok(res);
    }

    // GET: api/Projects/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDto>> GetProject(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Customer)
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

        if (project == null)
        {
            return NotFound();
        }

        return project.Adapt<ProjectDto>();
    }

    // POST: api/Projects
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> PostProject(CreateProjectDto projectDto)
    {
        var project = projectDto.Adapt<Project>();

        project.StartDate ??= DateOnly.FromDateTime(DateTime.UtcNow);

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        var resultDto = project.Adapt<ProjectDto>();
        return CreatedAtAction(nameof(GetProject), new { id = project.ProjectId }, resultDto);
    }

    // PUT: api/Projects/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProject(int id, UpdateProjectDto projectDto)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound();
        }

        projectDto.Adapt(project);
        _context.Entry(project).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProjectExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/Projects/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null)
        {
            return NotFound();
        }

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/Projects/5/tasks
    [HttpGet("{id}/tasks")]
    public async Task<ActionResult<IEnumerable<CustomerTaskDto>>> GetProjectTasks(int id)
    {
        var tasks = await _context.Tasks
            .Where(t => t.ProjectId == id)
            .ProjectToType<CustomerTaskDto>()
            .ToListAsync();

        return tasks;
    }

    private bool ProjectExists(int id)
    {
        return _context.Projects.Any(e => e.ProjectId == id);
    }
}