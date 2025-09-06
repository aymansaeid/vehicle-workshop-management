using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public CustomersController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers
       .Include(c => c.CustomerCars)
       .Include(c => c.CustomerContacts)
       .Include(c => c.Tasks)
       .FirstOrDefaultAsync(c => c.CustomerId == id);

            if (customer == null)
            {
                return NotFound();
            }

            var result = customer.Adapt<CustomerDto>();

            return Ok(result);

        }

        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult<CustomerDto>> PostCustomer(CreateCustomerDto createDto)
        {
            // 1. Adapt DTO to Entity
            var customerEntity = createDto.Adapt<Customer>();

            // 2. Add to context and save
            _context.Customers.Add(customerEntity);
            await _context.SaveChangesAsync();

            // 3. Adapt Entity back to DTO for response
            var resultDto = customerEntity.Adapt<CustomerDto>();

            return CreatedAtAction(
                nameof(GetCustomer),
                new { id = customerEntity.CustomerId },
                resultDto);
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers
                .Include(c => c.CustomerCars)
                .Include(c => c.CustomerContacts)
                .FirstOrDefaultAsync(c => c.CustomerId == id);

            if (customer == null)
                return NotFound();

            _context.CustomerCars.RemoveRange(customer.CustomerCars);
            _context.CustomerContacts.RemoveRange(customer.CustomerContacts);
            _context.Customers.Remove(customer);

            await _context.SaveChangesAsync();
            return NoContent();
        }
        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, UpdateCustomerDto updateDto)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            updateDto.Adapt(customer);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // Return updated customer as DTO
            var resultDto = customer.Adapt<CustomerDto>();
            return Ok(resultDto);
        }
        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.CustomerId == id);
        }
    }
}
