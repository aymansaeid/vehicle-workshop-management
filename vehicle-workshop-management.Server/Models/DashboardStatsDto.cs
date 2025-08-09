namespace vehicle_workshop_management.Server.Models
{
    public class DashboardStatsDto
    {
        public int ActiveTasks { get; set; }
        public int PendingInvoices { get; set; }
        public decimal Revenue { get; set; }

        /*
        public int ActiveTasks { get; set; }
        public int PendingInvoices { get; set; }
        public int CompletedTasks { get; set; }
        public decimal TotalRevenue { get; set; }
        public int OverdueTasks { get; set; }
        public int ActiveEmployees { get; set; }
 */
    }
}
