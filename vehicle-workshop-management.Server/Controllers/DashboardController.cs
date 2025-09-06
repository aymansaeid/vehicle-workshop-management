using Microsoft.AspNetCore.Mvc;
using Mapster;
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

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

            var stats = new DashboardStatsDto
            {
                // Basic counts
                TotalCustomers = await _context.Customers.CountAsync(),
                ActiveCustomers = await _context.Customers.CountAsync(c => c.Status == "Active"),
                TotalEmployees = await _context.Employees.CountAsync(),
                EmployeesAttendedToday = await _context.Employees.CountAsync(e =>
                    e.LastPresentDate.HasValue && e.LastPresentDate.Value == DateOnly.FromDateTime(today)),

                // Projects and Tasks
                TotalProjects = await _context.Projects.CountAsync(),
                ActiveProjects = await _context.Projects.CountAsync(p => p.Status == "Active"),
                TotalTasks = await _context.Tasks.CountAsync(),
                UnfinishedTasks = await _context.Tasks.CountAsync(t =>
                    t.Status != "Completed" && t.Status != "Finished"),
                OverdueTasks = await _context.Tasks.CountAsync(t =>
                    t.EndTime < DateTime.Now && t.Status != "Completed" && t.Status != "Finished"),

                // Inventory
                TotalInventoryItems = await _context.Inventories.CountAsync(),
                AvailableInventoryItems = await _context.Inventories.CountAsync(i => i.Status == "Available"),

                // Financial metrics
                TotalInvoices = await _context.Invoices.CountAsync(),
                PaidInvoices = await _context.Invoices.CountAsync(i => i.Status == "Paid"),
                UnpaidInvoices = await _context.Invoices.CountAsync(i => i.Status == "Unpaid"),
                PendingInvoices = await _context.Invoices.CountAsync(i => i.Status == "Pending"),

                TotalRevenue = await _context.Invoices
                    .Where(i => i.Status == "Paid")
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0,

                MonthlyRevenue = await _context.Invoices
                    .Where(i => i.Status == "Paid" &&
                           i.DateIssued.HasValue &&
                           i.DateIssued.Value >= DateOnly.FromDateTime(startOfMonth) &&
                           i.DateIssued.Value <= DateOnly.FromDateTime(endOfMonth))
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0,

                OutstandingAmount = await _context.Invoices
                    .Where(i => i.Status == "Unpaid" || i.Status == "Pending")
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0
            };

            return Ok(stats);
        }

        // GET: api/dashboard/financial-summary
        [HttpGet("financial-summary")]
        public async Task<ActionResult<FinancialSummaryDto>> GetFinancialSummary()
        {
            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var startOfLastMonth = startOfMonth.AddMonths(-1);

            var summary = new FinancialSummaryDto
            {
                ThisMonthRevenue = await _context.Invoices
                    .Where(i => i.Status == "Paid" &&
                           i.DateIssued.HasValue &&
                           i.DateIssued.Value >= DateOnly.FromDateTime(startOfMonth))
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0,

                LastMonthRevenue = await _context.Invoices
                    .Where(i => i.Status == "Paid" &&
                           i.DateIssued.HasValue &&
                           i.DateIssued.Value >= DateOnly.FromDateTime(startOfLastMonth) &&
                           i.DateIssued.Value < DateOnly.FromDateTime(startOfMonth))
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0,

                TotalOutstanding = await _context.Invoices
                    .Where(i => i.Status == "Unpaid" || i.Status == "Pending")
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0,

                OverdueAmount = await _context.Invoices
                    .Where(i => (i.Status == "Unpaid" || i.Status == "Pending") &&
                           i.DueDate.HasValue &&
                           i.DueDate.Value < DateOnly.FromDateTime(today))
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0
            };

            return Ok(summary);
        }

        // GET: api/dashboard/overdue-tasks
        [HttpGet("overdue-tasks")]
        public async Task<ActionResult<IEnumerable<OverdueTaskDto>>> GetOverdueTasks()
        {
            var today = DateTime.UtcNow;
            var overdueTasks = await _context.Tasks
                .AsNoTracking()
                .Where(t => t.EndTime < today && t.Status != "Completed" && t.Status != "Finished")
                .Select(t => new OverdueTaskDto
                {
                    TaskID = t.TaskId,
                    Name = t.Name,
                    Description = t.Description,
                    EndTime = (DateTime)t.EndTime,
                    Status = t.Status,
                    DaysOverdue = t.EndTime.HasValue
    ? (int)(today - t.EndTime.Value).TotalDays
    : 0
                })
                .ToListAsync();

            return Ok(overdueTasks);
        }

        [HttpGet("unpaid-invoices")]
        public async Task<ActionResult<IEnumerable<UnpaidInvoiceDto>>> GetUnpaidInvoices()
        {
            var invoices = await _context.Invoices
                .AsNoTracking()
                .Where(i => i.Status == "Unpaid" || i.Status == "Pending")
                .ToListAsync(); // 👈 fetch data first from SQL

            var unpaidInvoices = invoices
                .Select(i => new UnpaidInvoiceDto
                {
                    InvoiceID = i.InvoiceId,
                    DateIssued = i.DateIssued.HasValue
                        ? i.DateIssued.Value.ToDateTime(TimeOnly.MinValue)
                        : DateTime.MinValue,
                    DueDate = i.DueDate.HasValue
                        ? i.DueDate.Value.ToDateTime(TimeOnly.MinValue)
                        : DateTime.MinValue,
                    TotalAmount = (decimal)i.TotalAmount,
                    Status = i.Status,
                    DaysOverdue = i.DueDate.HasValue && i.DueDate.Value < DateOnly.FromDateTime(DateTime.Today)
                        ? (int)(DateTime.Today - i.DueDate.Value.ToDateTime(TimeOnly.MinValue)).TotalDays
                        : 0
                })
                .OrderBy(i => i.DueDate) // now works in memory
                .ToList(); // 👈 sync list

            return Ok(unpaidInvoices);
        }



        // GET: api/dashboard/recent-activity
        [HttpGet("recent-activity")]
        public async Task<ActionResult<RecentActivityDto>> GetRecentActivity()
        {
            var sevenDaysAgo = DateTime.Today.AddDays(-7);

            var activity = new RecentActivityDto
            {
                NewCustomersThisWeek = await _context.Customers
                    .CountAsync(c => c.CreatedAt >= sevenDaysAgo),

                CompletedTasksThisWeek = await _context.Tasks
                    .CountAsync(t => (t.Status == "Completed" || t.Status == "Finished") &&
                               t.EndTime >= sevenDaysAgo),

                InvoicesIssuedThisWeek = await _context.Invoices
                    .CountAsync(i => i.DateIssued.HasValue &&
                               i.DateIssued.Value >= DateOnly.FromDateTime(sevenDaysAgo)),

                RevenueThisWeek = await _context.Invoices
                    .Where(i => i.Status == "Paid" &&
                           i.DateIssued.HasValue &&
                           i.DateIssued.Value >= DateOnly.FromDateTime(sevenDaysAgo))
                    .SumAsync(i => (decimal?)i.TotalAmount) ?? 0
            };

            return Ok(activity);
        }

        // GET: api/dashboard/employee-performance
        [HttpGet("employee-performance")]
        public async Task<ActionResult<IEnumerable<EmployeePerformanceDto>>> GetEmployeePerformance()
        {
            var thirtyDaysAgo = DateTime.Today.AddDays(-30);

            var performance = await _context.Employees
                .AsNoTracking()
                .Select(e => new EmployeePerformanceDto
                {
                    EmployeeID = e.EmployeeId,
                    Name = e.Name,
                    Type = e.Type,
                    Status = e.Status,
                    TasksCompletedThisMonth = _context.TaskLines
                        .Join(_context.Tasks, tl => tl.TaskId, t => t.TaskId, (tl, t) => new { tl, t })
                        .Count(x => x.tl.EmployeeId == e.EmployeeId &&
                               (x.t.Status == "Completed" || x.t.Status == "Finished") &&
                               x.t.EndTime >= thirtyDaysAgo),

                    LastLoginDate = e.LastLogin,
                    LastPresentDate = e.LastPresentDate.HasValue
                        ? e.LastPresentDate.Value.ToDateTime(TimeOnly.MinValue)
                        : (DateTime?)null
                })
                .Where(e => e.Status == "Active")
                .OrderByDescending(e => e.TasksCompletedThisMonth)
                .ToListAsync();

            return Ok(performance);
        }
    }
}