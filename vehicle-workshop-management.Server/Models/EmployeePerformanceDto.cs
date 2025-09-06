namespace vehicle_workshop_management.Server.Models
{
    public class EmployeePerformanceDto
    {
        public int EmployeeID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int TasksCompletedThisMonth { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public DateTime? LastPresentDate { get; set; }
    }
}
