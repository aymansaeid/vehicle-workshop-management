namespace vehicle_workshop_management.Server.Models
{
    public class UpdateTaskDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string DelayReason { get; set; }
    }
}
