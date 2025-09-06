namespace vehicle_workshop_management.Server.Models
{
    public class RecentActivityDto
    {
        public int NewCustomersThisWeek { get; set; }
        public int CompletedTasksThisWeek { get; set; }
        public int InvoicesIssuedThisWeek { get; set; }
        public decimal RevenueThisWeek { get; set; }
    }
}
