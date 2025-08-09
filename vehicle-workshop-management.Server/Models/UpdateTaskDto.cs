namespace vehicle_workshop_management.Server.Models
{
    public class UpdateTaskDto
    {
     
        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public DateTime? ReceivedAt { get; set; }

        public DateTime? DeliveredAt { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string DelayReason { get; set; }
    }
}
