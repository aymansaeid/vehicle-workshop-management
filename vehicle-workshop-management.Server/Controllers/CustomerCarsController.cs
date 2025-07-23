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
    public class CustomerCarsController : Controller
    {
        private readonly DBCONTEXT _context;

        public CustomerCarsController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: CustomerCars
        public async Task<IActionResult> Index()
        {
            var dBCONTEXT = _context.CustomerCars.Include(c => c.Customer);
            return View(await dBCONTEXT.ToListAsync());
        }

        // GET: CustomerCars/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerCar = await _context.CustomerCars
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.CarId == id);
            if (customerCar == null)
            {
                return NotFound();
            }

            return View(customerCar);
        }

        // GET: CustomerCars/Create
        public IActionResult Create()
        {
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId");
            return View();
        }

        // POST: CustomerCars/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CarId,CustomerId,LicensePlate,PlateType,Make,Model,Year,Vin,Color,EngineType,TransmissionType,Status,WarrantyStartDate,WarrantyEndDate,WarrantyMaxMileage")] CustomerCar customerCar)
        {
            if (ModelState.IsValid)
            {
                _context.Add(customerCar);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId", customerCar.CustomerId);
            return View(customerCar);
        }

        // GET: CustomerCars/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerCar = await _context.CustomerCars.FindAsync(id);
            if (customerCar == null)
            {
                return NotFound();
            }
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId", customerCar.CustomerId);
            return View(customerCar);
        }

        // POST: CustomerCars/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CarId,CustomerId,LicensePlate,PlateType,Make,Model,Year,Vin,Color,EngineType,TransmissionType,Status,WarrantyStartDate,WarrantyEndDate,WarrantyMaxMileage")] CustomerCar customerCar)
        {
            if (id != customerCar.CarId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(customerCar);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CustomerCarExists(customerCar.CarId))
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
            ViewData["CustomerId"] = new SelectList(_context.Customers, "CustomerId", "CustomerId", customerCar.CustomerId);
            return View(customerCar);
        }

        // GET: CustomerCars/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerCar = await _context.CustomerCars
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(m => m.CarId == id);
            if (customerCar == null)
            {
                return NotFound();
            }

            return View(customerCar);
        }

        // POST: CustomerCars/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var customerCar = await _context.CustomerCars.FindAsync(id);
            if (customerCar != null)
            {
                _context.CustomerCars.Remove(customerCar);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CustomerCarExists(int id)
        {
            return _context.CustomerCars.Any(e => e.CarId == id);
        }
    }
}
