using Mapster;
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
        public async Task<ActionResult<IEnumerable<InvoiceLineDto>>> GetInvoiceLines()
        {
            var invoicesLine = await _context.InvoiceLines
                .Include(i => i.Inventory)
                .Include(i => i.Invoice)
                .Include(i => i.TaskLine)
                .ToListAsync();
            var res = invoicesLine.Adapt<List<InvoiceLineDto>>();
            return Ok(res);
        }

        // GET: api/InvoiceLines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceLineDto>> GetInvoiceLine(int id)
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
            var invoiceLineDto = invoiceLine.Adapt<InvoiceLineDto>();

            return invoiceLineDto;
        }

        // POST: api/InvoiceLines
        [HttpPost]
        public async Task<ActionResult<InvoiceLineDto>> PostInvoiceLine(CreateInvoiceLineDto invoiceLineDto)
        {
            // Validate required fields
            if (invoiceLineDto.InvoiceId == null || invoiceLineDto.InvoiceId <= 0)
            {
                return BadRequest("Valid InvoiceId is required");
            }

            // Verify the parent invoice exists
            var invoiceExists = await _context.Invoices.AnyAsync(i => i.InvoiceId == invoiceLineDto.InvoiceId);
            if (!invoiceExists)
            {
                return NotFound($"Invoice with ID {invoiceLineDto.InvoiceId} not found");
            }

       

            // Map to entity
            var invoiceLine = invoiceLineDto.Adapt<InvoiceLine>();

            // Ensure proper relationship
            invoiceLine.InvoiceId = invoiceLineDto.InvoiceId.Value;

            _context.InvoiceLines.Add(invoiceLine);
            var invoice = await _context.Invoices
       .Include(i => i.InvoiceLines)
       .FirstOrDefaultAsync(i => i.InvoiceId == invoiceLine.InvoiceId);

            if (invoice != null)
            {
                invoice.TotalAmount = invoice.InvoiceLines.Sum(il => il.LineTotal);
                _context.Entry(invoice).State = EntityState.Modified;
            }
            await _context.SaveChangesAsync();

            // Return the complete DTO with relationships
            var resultDto = invoiceLine.Adapt<InvoiceLineDto>();
            return CreatedAtAction(
                nameof(GetInvoiceLine),
                new { id = invoiceLine.LineId },
                resultDto);
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
            //  store the InvoiceId before deletion (needed to update the parent)
            var invoiceId = invoiceLine.InvoiceId;

            // delete the line
            _context.InvoiceLines.Remove(invoiceLine);
            await _context.SaveChangesAsync();

            // recalculate and update the parent Invoice's taotal amount
            var invoice = await _context.Invoices
                .Include(i => i.InvoiceLines)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);

            if (invoice != null)
            {
                invoice.TotalAmount = invoice.InvoiceLines.Sum(il => il.LineTotal);
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }

        private bool InvoiceLineExists(int id)
        {
            return _context.InvoiceLines.Any(e => e.LineId == id);
        }
    }
}