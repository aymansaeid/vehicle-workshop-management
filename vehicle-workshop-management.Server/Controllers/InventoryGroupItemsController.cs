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
    public class InventoryGroupItemsController : Controller
    {
        private readonly DBCONTEXT _context;

        public InventoryGroupItemsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: InventoryGroupItems
        public async Task<IActionResult> Index()
        {
            var dBCONTEXT = _context.InventoryGroupItems.Include(i => i.Group).Include(i => i.Inventory);
            return View(await dBCONTEXT.ToListAsync());
        }

        // GET: InventoryGroupItems/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryGroupItem = await _context.InventoryGroupItems
                .Include(i => i.Group)
                .Include(i => i.Inventory)
                .FirstOrDefaultAsync(m => m.InventoryId == id);
            if (inventoryGroupItem == null)
            {
                return NotFound();
            }

            return View(inventoryGroupItem);
        }

        // GET: InventoryGroupItems/Create
        public IActionResult Create()
        {
            ViewData["GroupId"] = new SelectList(_context.InventoryGroups, "GroupId", "GroupId");
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId");
            return View();
        }

        // POST: InventoryGroupItems/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("InventoryId,GroupId")] InventoryGroupItem inventoryGroupItem)
        {
            if (ModelState.IsValid)
            {
                _context.Add(inventoryGroupItem);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["GroupId"] = new SelectList(_context.InventoryGroups, "GroupId", "GroupId", inventoryGroupItem.GroupId);
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", inventoryGroupItem.InventoryId);
            return View(inventoryGroupItem);
        }

        // GET: InventoryGroupItems/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryGroupItem = await _context.InventoryGroupItems.FindAsync(id);
            if (inventoryGroupItem == null)
            {
                return NotFound();
            }
            ViewData["GroupId"] = new SelectList(_context.InventoryGroups, "GroupId", "GroupId", inventoryGroupItem.GroupId);
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", inventoryGroupItem.InventoryId);
            return View(inventoryGroupItem);
        }

        // POST: InventoryGroupItems/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("InventoryId,GroupId")] InventoryGroupItem inventoryGroupItem)
        {
            if (id != inventoryGroupItem.InventoryId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(inventoryGroupItem);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!InventoryGroupItemExists(inventoryGroupItem.InventoryId))
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
            ViewData["GroupId"] = new SelectList(_context.InventoryGroups, "GroupId", "GroupId", inventoryGroupItem.GroupId);
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", inventoryGroupItem.InventoryId);
            return View(inventoryGroupItem);
        }

        // GET: InventoryGroupItems/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryGroupItem = await _context.InventoryGroupItems
                .Include(i => i.Group)
                .Include(i => i.Inventory)
                .FirstOrDefaultAsync(m => m.InventoryId == id);
            if (inventoryGroupItem == null)
            {
                return NotFound();
            }

            return View(inventoryGroupItem);
        }

        // POST: InventoryGroupItems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var inventoryGroupItem = await _context.InventoryGroupItems.FindAsync(id);
            if (inventoryGroupItem != null)
            {
                _context.InventoryGroupItems.Remove(inventoryGroupItem);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool InventoryGroupItemExists(int id)
        {
            return _context.InventoryGroupItems.Any(e => e.InventoryId == id);
        }
    }
}
