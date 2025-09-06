namespace vehicle_workshop_management.Server.Models
{
    public class OverdueTaskDto
    {
        public int TaskID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int DaysOverdue { get; set; }
    }
}
