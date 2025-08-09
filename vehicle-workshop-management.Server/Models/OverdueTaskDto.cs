namespace vehicle_workshop_management.Server.Models
{
    public class OverdueTaskDto
    {
        public int TaskID { get; set; }
        public string Name { get; set; }
        public DateTime? EndTime { get; set; }
        public string Status { get; set; }
    }
}
