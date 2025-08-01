namespace vehicle_workshop_management.Server.Models
{
    public class TaskDto
    {
        public int TaskId { get; set; }

        public int? ProjectId { get; set; }

        public int? CustomerId { get; set; }

        public int? CarId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public string? Status { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public DateTime? ReceivedAt { get; set; }

        public DateTime? DeliveredAt { get; set; }

        public string? DelayReason { get; set; }

        public virtual TaskCarDto? Car { get; set; }

        public virtual TaskCustomerDto? Customer { get; set; }

        public virtual TaskProjectDto? Project { get; set; }

        public List<TaskLineDto> TaskLines { get; set; }
        
    }
}
