using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerCarsController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public CustomerCarsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/CustomerCars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerCar>>> GetCustomerCars()
        {
            return await _context.CustomerCars.Include(c => c.Customer).ToListAsync();
        }

        // GET: api/CustomerCars/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerCar>> GetCustomerCar(int id)
        {
            var customerCar = await _context.CustomerCars
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.CarId == id);

            if (customerCar == null)
                return NotFound();

            return customerCar;
        }

        // POST: api/CustomerCars
        [HttpPost]
        public async Task<ActionResult<CustomerCar>> PostCustomerCar(CustomerCar customerCar)
        {
            _context.CustomerCars.Add(customerCar);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomerCar), new { id = customerCar.CarId }, customerCar);
        }

        // PUT: api/CustomerCars/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomerCar(int id, CustomerCar customerCar)
        {
            if (id != customerCar.CarId)
                return BadRequest();

            _context.Entry(customerCar).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerCarExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/CustomerCars/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerCar(int id)
        {
            var customerCar = await _context.CustomerCars.FindAsync(id);
            if (customerCar == null)
                return NotFound();

            _context.CustomerCars.Remove(customerCar);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerCarExists(int id)
        {
            return _context.CustomerCars.Any(e => e.CarId == id);
        }
    }
}
