using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceLinesController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public InvoiceLinesController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/InvoiceLines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceLine>>> GetInvoiceLines()
        {
            return await _context.InvoiceLines
                .Include(i => i.Inventory)
                .Include(i => i.Invoice)
                .Include(i => i.TaskLine)
                .ToListAsync();
        }

        // GET: api/InvoiceLines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceLine>> GetInvoiceLine(int id)
        {
            var invoiceLine = await _context.InvoiceLines
                .Include(i => i.Inventory)
                .Include(i => i.Invoice)
                .Include(i => i.TaskLine)
                .FirstOrDefaultAsync(m => m.LineId == id);

            if (invoiceLine == null)
            {
                return NotFound();
            }

            return invoiceLine;
        }

        // POST: api/InvoiceLines
        [HttpPost]
        public async Task<ActionResult<InvoiceLine>> PostInvoiceLine(InvoiceLine invoiceLine)
        {
            // Calculate line total if not provided
            if (invoiceLine.LineTotal == 0 && invoiceLine.Quantity > 0 && invoiceLine.UnitPrice > 0)
            {
                invoiceLine.LineTotal = invoiceLine.Quantity * invoiceLine.UnitPrice;
            }

            _context.InvoiceLines.Add(invoiceLine);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoiceLine), new { id = invoiceLine.LineId }, invoiceLine);
        }

        // PUT: api/InvoiceLines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoiceLine(int id, InvoiceLine invoiceLine)
        {
            if (id != invoiceLine.LineId)
            {
                return BadRequest();
            }

            // Recalculate line total if quantity or unit price changes
            invoiceLine.LineTotal = invoiceLine.Quantity * invoiceLine.UnitPrice;

            _context.Entry(invoiceLine).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceLineExists(id))
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

        // DELETE: api/InvoiceLines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoiceLine(int id)
        {
            var invoiceLine = await _context.InvoiceLines.FindAsync(id);
            if (invoiceLine == null)
            {
                return NotFound();
            }

            _context.InvoiceLines.Remove(invoiceLine);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InvoiceLineExists(int id)
        {
            return _context.InvoiceLines.Any(e => e.LineId == id);
        }
    }
}