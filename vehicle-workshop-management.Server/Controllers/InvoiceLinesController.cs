using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    public class InvoiceLinesController : Controller
    {
        private readonly DBCONTEXT _context;

        public InvoiceLinesController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: InvoiceLines
        public async Task<IActionResult> Index()
        {
            var dBCONTEXT = _context.InvoiceLines.Include(i => i.Inventory).Include(i => i.Invoice).Include(i => i.TaskLine);
            return View(await dBCONTEXT.ToListAsync());
        }

        // GET: InvoiceLines/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var invoiceLine = await _context.InvoiceLines
                .Include(i => i.Inventory)
                .Include(i => i.Invoice)
                .Include(i => i.TaskLine)
                .FirstOrDefaultAsync(m => m.LineId == id);
            if (invoiceLine == null)
            {
                return NotFound();
            }

            return View(invoiceLine);
        }

        // GET: InvoiceLines/Create
        public IActionResult Create()
        {
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId");
            ViewData["InvoiceId"] = new SelectList(_context.Invoices, "InvoiceId", "InvoiceId");
            ViewData["TaskLineId"] = new SelectList(_context.TaskLines, "TaskLineId", "TaskLineId");
            return View();
        }

        // POST: InvoiceLines/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("LineId,InvoiceId,TaskLineId,InventoryId,Description,Quantity,UnitPrice,LineTotal")] InvoiceLine invoiceLine)
        {
            if (ModelState.IsValid)
            {
                _context.Add(invoiceLine);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", invoiceLine.InventoryId);
            ViewData["InvoiceId"] = new SelectList(_context.Invoices, "InvoiceId", "InvoiceId", invoiceLine.InvoiceId);
            ViewData["TaskLineId"] = new SelectList(_context.TaskLines, "TaskLineId", "TaskLineId", invoiceLine.TaskLineId);
            return View(invoiceLine);
        }

        // GET: InvoiceLines/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var invoiceLine = await _context.InvoiceLines.FindAsync(id);
            if (invoiceLine == null)
            {
                return NotFound();
            }
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", invoiceLine.InventoryId);
            ViewData["InvoiceId"] = new SelectList(_context.Invoices, "InvoiceId", "InvoiceId", invoiceLine.InvoiceId);
            ViewData["TaskLineId"] = new SelectList(_context.TaskLines, "TaskLineId", "TaskLineId", invoiceLine.TaskLineId);
            return View(invoiceLine);
        }

        // POST: InvoiceLines/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("LineId,InvoiceId,TaskLineId,InventoryId,Description,Quantity,UnitPrice,LineTotal")] InvoiceLine invoiceLine)
        {
            if (id != invoiceLine.LineId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(invoiceLine);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!InvoiceLineExists(invoiceLine.LineId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", invoiceLine.InventoryId);
            ViewData["InvoiceId"] = new SelectList(_context.Invoices, "InvoiceId", "InvoiceId", invoiceLine.InvoiceId);
            ViewData["TaskLineId"] = new SelectList(_context.TaskLines, "TaskLineId", "TaskLineId", invoiceLine.TaskLineId);
            return View(invoiceLine);
        }

        // GET: InvoiceLines/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var invoiceLine = await _context.InvoiceLines
                .Include(i => i.Inventory)
                .Include(i => i.Invoice)
                .Include(i => i.TaskLine)
                .FirstOrDefaultAsync(m => m.LineId == id);
            if (invoiceLine == null)
            {
                return NotFound();
            }

            return View(invoiceLine);
        }

        // POST: InvoiceLines/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var invoiceLine = await _context.InvoiceLines.FindAsync(id);
            if (invoiceLine != null)
            {
                _context.InvoiceLines.Remove(invoiceLine);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool InvoiceLineExists(int id)
        {
            return _context.InvoiceLines.Any(e => e.LineId == id);
        }
    }
}
