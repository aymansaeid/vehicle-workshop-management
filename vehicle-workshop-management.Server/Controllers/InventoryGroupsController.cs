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
    public class InventoryGroupsController : Controller
    {
        private readonly DBCONTEXT _context;

        public InventoryGroupsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: InventoryGroups
        public async Task<IActionResult> Index()
        {
            return View(await _context.InventoryGroups.ToListAsync());
        }

        // GET: InventoryGroups/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryGroup = await _context.InventoryGroups
                .FirstOrDefaultAsync(m => m.GroupId == id);
            if (inventoryGroup == null)
            {
                return NotFound();
            }

            return View(inventoryGroup);
        }

        // GET: InventoryGroups/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: InventoryGroups/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("GroupId,Name,Description")] InventoryGroup inventoryGroup)
        {
            if (ModelState.IsValid)
            {
                _context.Add(inventoryGroup);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(inventoryGroup);
        }

        // GET: InventoryGroups/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryGroup = await _context.InventoryGroups.FindAsync(id);
            if (inventoryGroup == null)
            {
                return NotFound();
            }
            return View(inventoryGroup);
        }

        // POST: InventoryGroups/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("GroupId,Name,Description")] InventoryGroup inventoryGroup)
        {
            if (id != inventoryGroup.GroupId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(inventoryGroup);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!InventoryGroupExists(inventoryGroup.GroupId))
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
            return View(inventoryGroup);
        }

        // GET: InventoryGroups/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var inventoryGroup = await _context.InventoryGroups
                .FirstOrDefaultAsync(m => m.GroupId == id);
            if (inventoryGroup == null)
            {
                return NotFound();
            }

            return View(inventoryGroup);
        }

        // POST: InventoryGroups/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var inventoryGroup = await _context.InventoryGroups.FindAsync(id);
            if (inventoryGroup != null)
            {
                _context.InventoryGroups.Remove(inventoryGroup);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool InventoryGroupExists(int id)
        {
            return _context.InventoryGroups.Any(e => e.GroupId == id);
        }
    }
}
