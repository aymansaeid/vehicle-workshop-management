using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public SearchController(DBCONTEXT context)
        {
            _context = context;
        }
        [HttpGet("search/global")]
        public async Task<ActionResult<GlobalSearchResult>> GlobalSearch(
      [FromQuery] string q,
      [FromQuery] string types = "")
        {
            var results = new GlobalSearchResult();
            var searchTypes = types.Split(',', StringSplitOptions.RemoveEmptyEntries);

            if (searchTypes.Contains("customers") || searchTypes.Length == 0)
            {
                var customers = await _context.Customers
                    .Where(c => c.Name.Contains(q) || c.Email.Contains(q) || c.Phone.Contains(q))
                    .Take(5)
                    .ToListAsync();

                results.Customers = customers.Adapt<List<CustomerSearchResult>>();
            }

            if (searchTypes.Contains("employees") || searchTypes.Length == 0)
            {
                var employees = await _context.Employees
                    .Where(e => e.Name.Contains(q) || e.Email.Contains(q))
                    .Take(5)
                    .ToListAsync();

                results.Employees = employees.Adapt<List<EmployeeSearchResult>>();
            }

            if (searchTypes.Contains("inventory") || searchTypes.Length == 0)
            {
                var inventory = await _context.Inventories
                    .Where(i => i.Name.Contains(q) || i.Description.Contains(q))
                    .Take(5)
                    .ToListAsync();

                results.Inventory = inventory.Adapt<List<InventorySearchResult>>();
            }

            return Ok(results);
        }


    }
}
