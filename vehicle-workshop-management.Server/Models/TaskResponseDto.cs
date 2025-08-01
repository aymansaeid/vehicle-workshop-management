namespace vehicle_workshop_management.Server.Models
{
    public class TaskResponseDto
    {
        public int TaskId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? DeliveredAt { get; set; }
        public string DelayReason { get; set; }

        // Simplified references
        public TaskCarDto Car { get; set; }
        public TaskCustomerDto Customer { get; set; }
        public TaskProjectDto Project { get; set; } // Will be omitted if null
        public List<TaskLineDto> TaskLines { get; set; } = new();
    }
}
