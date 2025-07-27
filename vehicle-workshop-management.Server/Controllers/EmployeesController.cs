using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public EmployeesController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound();

            return employee;
        }

        // POST: api/Employees
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
        }

        // PUT: api/Employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, Employee employee)
        {
            if (id != employee.EmployeeId)
                return BadRequest();

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeId == id);
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] Models.Register user)
        {
            if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Email) ||
                string.IsNullOrEmpty(user.Phone) || string.IsNullOrEmpty(user.Type) ||
                string.IsNullOrEmpty(user.Status) ||
                string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("All fields are required");
            }
            if (await _context.Employees.AnyAsync(u => u.Username == user.Username))
                return BadRequest("User already exists");
            if (await _context.Employees.AnyAsync(u => u.Phone == user.Phone))
                return BadRequest("PHOne already exists");



            var employee = new Employee
            {
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Type = user.Type,
                Status = "Active",
                HireDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Username = user.Username,
                Password = user.Password
            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            var response = new
            {
                employee.EmployeeId,
                employee.Name,
                employee.Username,
                employee.Status,
                employee.HireDate
            };

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, response);

        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            if (string.IsNullOrEmpty(loginRequest.Username) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Username and Password are required");
            }
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Username == loginRequest.Username && e.Password == loginRequest.Password && e.Status == "Active");
            if (employee == null)
            {
                return Unauthorized("Invalid Username or Password");
            }
            var response = new
            {
                employee.EmployeeId,
                employee.Name,
                employee.Username,
                employee.Status,
                employee.HireDate
            };
            return Ok(response);
        }

        [HttpPost("{id}/attendance")]
        public async Task<IActionResult> MarkAttendance(int id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
                return NotFound($"Employee with ID {id} not found.");

            // Update LastPresentDate
            employee.LastPresentDate = DateOnly.FromDateTime(DateTime.UtcNow);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Attendance marked for {employee.Name}.",
                employee.EmployeeId,
                employee.LastPresentDate
            });
        }
        [HttpGet("attendance/today")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetTodayAttendance()
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var presentEmployees = await _context.Employees
                .Where(e => e.LastPresentDate == today)
                .ToListAsync();

            return Ok(presentEmployees);
        }
        [HttpGet("attendance/absent")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAbsentEmployees()
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var absentEmployees = await _context.Employees
                .Where(e => e.LastPresentDate != today || e.LastPresentDate == null)
                .ToListAsync();
            return Ok(absentEmployees);
        }
        [HttpGet("attendance")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAttendance([FromQuery] DateOnly? date = null)
        {
            var targetDate = date ?? DateOnly.FromDateTime(DateTime.UtcNow);

            var data = await _context.Employees
                .Select(e => new
                {
                    e.EmployeeId,
                    e.Name,
                    e.Type,
                    e.Status,
                    e.LastPresentDate,
                    IsPresentToday = e.LastPresentDate.HasValue && e.LastPresentDate.Value == targetDate
                })
                .OrderByDescending(x => x.IsPresentToday)
                .ThenBy(x => x.Name)
                .ToListAsync();

            var result = new
            {
                Date = targetDate,
                Total = data.Count,
                Present = data.Count(x => x.IsPresentToday),
                Absent = data.Count(x => !x.IsPresentToday),
                Employees = data
            };

            return Ok(result);
        }


    }
}
