namespace vehicle_workshop_management.Server.Models
{
    public class DashboardStatsDto
    {
        public int TotalCustomers { get; set; }
        public int ActiveCustomers { get; set; }
        public int TotalEmployees { get; set; }
        public int EmployeesAttendedToday { get; set; }
        public int TotalProjects { get; set; }
        public int ActiveProjects { get; set; }
        public int TotalTasks { get; set; }
        public int UnfinishedTasks { get; set; }
        public int OverdueTasks { get; set; }
        public int TotalInventoryItems { get; set; }
        public int AvailableInventoryItems { get; set; }
        public int TotalInvoices { get; set; }
        public int PaidInvoices { get; set; }
        public int UnpaidInvoices { get; set; }
        public int PendingInvoices { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public decimal OutstandingAmount { get; set; }
    }
}
