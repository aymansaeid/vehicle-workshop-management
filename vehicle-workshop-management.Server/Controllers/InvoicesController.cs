using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public InvoicesController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/Invoices
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetInvoices()
        {
            var invoice =  await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.InvoiceLines)
                    .ThenInclude(il => il.Inventory)
                .ToListAsync();
            var res = invoice.Adapt<List<InvoiceDto>>();

            return Ok(res);
        }

        // GET: api/Invoices/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDto>> GetInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .FirstOrDefaultAsync(i => i.InvoiceId == id);
            
            if (invoice == null)
            {
                return NotFound();
            }

            return invoice.Adapt<InvoiceDto>();
        }

        // POST: api/Invoices
        [HttpPost]
        public async Task<ActionResult<InvoiceDto>> PostInvoice(UpdateInvoiceDto invoiceDto)
        {
            // Set default dates if not provided
            if (!invoiceDto.DateIssued.HasValue)
            {
                invoiceDto.DateIssued = DateOnly.FromDateTime(DateTime.UtcNow);
            }

            if (!invoiceDto.DueDate.HasValue)
            {
                invoiceDto.DueDate = invoiceDto.DateIssued.Value.AddDays(30); // Default 30-day payment term
            }

            // Validate dates
            if (invoiceDto.DueDate < invoiceDto.DateIssued)
            {
                return BadRequest("Due date cannot be earlier than issue date");
            }
            var invoice = invoiceDto.Adapt<Invoice>();
            // Calculate and set correct total amount
            if (invoice.InvoiceLines != null)
            {
                invoice.TotalAmount = invoice.InvoiceLines.Sum(il => il.LineTotal);
            }
            else
            {
                invoice.TotalAmount = 0;
            }
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.InvoiceId }, invoice);
        }

        // PUT: api/Invoices/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInvoice(int id, UpdateInvoiceDto invoiceDto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            invoiceDto.Adapt(invoice);
            // Recalculate total amount when updating
            invoice.TotalAmount = invoice.InvoiceLines?.Sum(il => il.LineTotal) ?? 0;

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InvoiceExists(id))
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
        // PATCH: api/Invoices/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchInvoiceStatus(int id, [FromBody] string status)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            invoice.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Invoices/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.Include(i => i.InvoiceLines).FirstOrDefaultAsync(i => i.InvoiceId == id);
            if (invoice == null)
            {
                return NotFound();
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/Invoices/5/lines
        [HttpGet("{id}/lines")]
        public async Task<ActionResult<IEnumerable<InvoiceLineDto>>> GetInvoiceLines(int id)
        {
            var invoiceLines = await _context.InvoiceLines
                .Where(il => il.InvoiceId == id)
                .Include(il => il.Inventory)
                .Include(il => il.TaskLine)
                 .ThenInclude(tl => tl.Employee)
                .ToListAsync();

            if (!invoiceLines.Any())
            {
                return NotFound();
            }
            var invoiceLineDtos = invoiceLines.Adapt<List<InvoiceLineDto>>();

            return invoiceLineDtos;
        }
        // Controllers/InvoicesController.cs
        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GeneratePdfInvoice(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.InvoiceLines)
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.InvoiceId == id);

            if (invoice == null) return NotFound();

            var dto = new InvoicePdfDto
            {
                InvoiceId = invoice.InvoiceId,
                CustomerName = invoice.Customer?.Name ?? "N/A",
                FormattedDate = invoice.DateIssued?.ToString("MMMM dd, yyyy") ?? "N/A", // Fixed ToString
                FormattedDueDate = invoice.DueDate?.ToString("MMMM dd, yyyy") ?? "N/A", // Fixed ToString
                Status = invoice.Status,
                Notes = invoice.Notes,
                TotalAmount = invoice.TotalAmount ?? 0m,
                InvoiceLines = invoice.InvoiceLines.Select(il => new InvoiceLinePdfDto
                {
                    Description = il.Description,
                    Quantity = (int)il.Quantity,
                    UnitPrice = (decimal)il.UnitPrice,
                  
                }).ToList()
            };

            var pdfBytes = new PdfInvoiceService().GeneratePdf(dto);
            return File(pdfBytes, "application/pdf", $"Invoice_{id}.pdf");
        }

        private bool InvoiceExists(int id)
        {
            return _context.Invoices.Any(e => e.InvoiceId == id);
        }
    }
}