using Mapster;
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
        public async Task<ActionResult<IEnumerable<CustomerContactDto>>> GetCustomerContacts()
        {
            var contacts = await _context.CustomerContacts
                .Include(c => c.Customer)
                .ToListAsync();

            return contacts.Adapt<List<CustomerContactDto>>();
        }


        // GET: api/CustomerContacts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerContactDto>> GetCustomerContact(int id)
        {
            var customerContact = await _context.CustomerContacts
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.ContactId == id);

            if (customerContact == null)
                return NotFound();

            var result = customerContact.Adapt<CustomerContactDto>();

            return Ok(result);
        }

        // POST: api/CustomerContacts
        [HttpPost("customers/{customerId}/contacts")]
        public async Task<ActionResult<CustomerContactDto>> PostCustomerContact(
      int customerId,
      [FromBody] CustomerContactDto contactDto)
        {
            // Verify customer exists
            var customerExists = await _context.Customers.AnyAsync(c => c.CustomerId == customerId);
            if (!customerExists)
            {
                return BadRequest("Invalid CustomerId");
            }
            var customerEntity = contactDto.Adapt<CustomerContact>();


            _context.CustomerContacts.Add(customerEntity);
            await _context.SaveChangesAsync();
            
            var resultDto = customerEntity.Adapt<CustomerContactDto>();
            return CreatedAtAction(nameof(GetCustomerContact), new { id = customerEntity.ContactId }, resultDto);
        }

        // PUT: api/CustomerContacts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomerContact(int id, CustomerContactDto contactDto)
        {
            if (id != contactDto.ContactId)
                return BadRequest();

            var existingContact = await _context.CustomerContacts.FindAsync(id);
            if (existingContact == null)
                return NotFound();

            contactDto.Adapt(existingContact);
            _context.Entry(existingContact).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerContactExists(id))
                    return NotFound();
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
