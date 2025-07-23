using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerContactsController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public CustomerContactsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/CustomerContacts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerContact>>> GetCustomerContacts()
        {
            return await _context.CustomerContacts.Include(c => c.Customer).ToListAsync();
        }

        // GET: api/CustomerContacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerContact>> GetCustomerContact(int id)
        {
            var customerContact = await _context.CustomerContacts
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.ContactId == id);

            if (customerContact == null)
                return NotFound();

            return customerContact;
        }

        // POST: api/CustomerContacts
        [HttpPost]
        public async Task<ActionResult<CustomerContact>> PostCustomerContact(CustomerContact customerContact)
        {
            _context.CustomerContacts.Add(customerContact);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomerContact), new { id = customerContact.ContactId }, customerContact);
        }

        // PUT: api/CustomerContacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomerContact(int id, CustomerContact customerContact)
        {
            if (id != customerContact.ContactId)
                return BadRequest();

            _context.Entry(customerContact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerContactExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/CustomerContacts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerContact(int id)
        {
            var customerContact = await _context.CustomerContacts.FindAsync(id);
            if (customerContact == null)
                return NotFound();

            _context.CustomerContacts.Remove(customerContact);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerContactExists(int id)
        {
            return _context.CustomerContacts.Any(e => e.ContactId == id);
        }
    }
}
