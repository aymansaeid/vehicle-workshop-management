using Microsoft.AspNetCore.Mvc;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vehicle_workshop_management.Server.Models;

namespace vehicle_workshop_management.Server.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly DBCONTEXT _context;

        public DashboardController(DBCONTEXT context)
        {
            _context = context;
        }

        // GET: api/dashboard
        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var stats = new DashboardStatsDto
            {
                ActiveTasks = await _context.Tasks.CountAsync(t => t.Status == "Active"),
                PendingInvoices = await _context.Invoices.CountAsync(i => i.Status == "Pending"),
                Revenue = await _context.Invoices
                    .Where(i => i.Status == "Paid")
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0
            };

            return Ok(stats);
        }
    }
}
