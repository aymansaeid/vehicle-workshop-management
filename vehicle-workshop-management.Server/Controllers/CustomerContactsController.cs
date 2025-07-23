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
    public class CustomerContactsController : Controller
    {
        private readonly DBCONTEXT _context;

        public CustomerContactsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: CustomerContacts
        public async Task<IActionResult> Index()
        {
            var dBCONTEXT = _context.CustomerContacts.Include(c => c.Customer);
            return View(await dBCONTEXT.ToListAsync());
        }

        // GET: CustomerContacts/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerContact = await _context.CustomerContacts
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.ContactId == id);
            if (customerContact == null)
            {
                return NotFound();
            }

            return View(customerContact);
        }

        // GET: CustomerContacts/Create
        public IActionResult Create()
        {
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId");
            return View();
        }

        // POST: CustomerContacts/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ContactId,CustomerId,Name,Role,Phone,Email")] CustomerContact customerContact)
        {
            if (ModelState.IsValid)
            {
                _context.Add(customerContact);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId", customerContact.CustomerId);
            return View(customerContact);
        }

        // GET: CustomerContacts/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerContact = await _context.CustomerContacts.FindAsync(id);
            if (customerContact == null)
            {
                return NotFound();
            }
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId", customerContact.CustomerId);
            return View(customerContact);
        }

        // POST: CustomerContacts/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ContactId,CustomerId,Name,Role,Phone,Email")] CustomerContact customerContact)
        {
            if (id != customerContact.ContactId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(customerContact);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CustomerContactExists(customerContact.ContactId))
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
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId", customerContact.CustomerId);
            return View(customerContact);
        }

        // GET: CustomerContacts/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerContact = await _context.CustomerContacts
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.ContactId == id);
            if (customerContact == null)
            {
                return NotFound();
            }

            return View(customerContact);
        }

        // POST: CustomerContacts/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var customerContact = await _context.CustomerContacts.FindAsync(id);
            if (customerContact != null)
            {
                _context.CustomerContacts.Remove(customerContact);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CustomerContactExists(int id)
        {
            return _context.CustomerContacts.Any(e => e.ContactId == id);
        }
    }
}
