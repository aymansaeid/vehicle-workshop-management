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
    public class TaskLinesController : Controller
    {
        private readonly DBCONTEXT _context;

        public TaskLinesController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: TaskLines
        public async Task<IActionResult> Index()
        {
            var dBCONTEXT = _context.TaskLines.Include(t => t.Employee).Include(t => t.Inventory).Include(t => t.Task);
            return View(await dBCONTEXT.ToListAsync());
        }

        // GET: TaskLines/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var taskLine = await _context.TaskLines
                .Include(t => t.Employee)
                .Include(t => t.Inventory)
                .Include(t => t.Task)
                .FirstOrDefaultAsync(m => m.TaskLineId == id);
            if (taskLine == null)
            {
                return NotFound();
            }

            return View(taskLine);
        }

        // GET: TaskLines/Create
        public IActionResult Create()
        {
            ViewData["EmployeeId"] = new SelectList(_context.Employees, "EmployeeId", "EmployeeId");
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId");
            ViewData["TaskId"] = new SelectList(_context.Tasks, "TaskId", "TaskId");
            return View();
        }

        // POST: TaskLines/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("TaskLineId,TaskId,InventoryId,EmployeeId,Quantity,Description,UnitPrice,LineTotal")] TaskLine taskLine)
        {
            if (ModelState.IsValid)
            {
                _context.Add(taskLine);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["EmployeeId"] = new SelectList(_context.Employees, "EmployeeId", "EmployeeId", taskLine.EmployeeId);
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", taskLine.InventoryId);
            ViewData["TaskId"] = new SelectList(_context.Tasks, "TaskId", "TaskId", taskLine.TaskId);
            return View(taskLine);
        }

        // GET: TaskLines/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var taskLine = await _context.TaskLines.FindAsync(id);
            if (taskLine == null)
            {
                return NotFound();
            }
            ViewData["EmployeeId"] = new SelectList(_context.Employees, "EmployeeId", "EmployeeId", taskLine.EmployeeId);
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", taskLine.InventoryId);
            ViewData["TaskId"] = new SelectList(_context.Tasks, "TaskId", "TaskId", taskLine.TaskId);
            return View(taskLine);
        }

        // POST: TaskLines/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("TaskLineId,TaskId,InventoryId,EmployeeId,Quantity,Description,UnitPrice,LineTotal")] TaskLine taskLine)
        {
            if (id != taskLine.TaskLineId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(taskLine);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TaskLineExists(taskLine.TaskLineId))
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
            ViewData["EmployeeId"] = new SelectList(_context.Employees, "EmployeeId", "EmployeeId", taskLine.EmployeeId);
            ViewData["InventoryId"] = new SelectList(_context.Inventories, "InventoryId", "InventoryId", taskLine.InventoryId);
            ViewData["TaskId"] = new SelectList(_context.Tasks, "TaskId", "TaskId", taskLine.TaskId);
            return View(taskLine);
        }

        // GET: TaskLines/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var taskLine = await _context.TaskLines
                .Include(t => t.Employee)
                .Include(t => t.Inventory)
                .Include(t => t.Task)
                .FirstOrDefaultAsync(m => m.TaskLineId == id);
            if (taskLine == null)
            {
                return NotFound();
            }

            return View(taskLine);
        }

        // POST: TaskLines/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var taskLine = await _context.TaskLines.FindAsync(id);
            if (taskLine != null)
            {
                _context.TaskLines.Remove(taskLine);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool TaskLineExists(int id)
        {
            return _context.TaskLines.Any(e => e.TaskLineId == id);
        }
    }
}
