namespace vehicle_workshop_management.Server.Models
{
    public class ProjectDto
    {
        public int ProjectId { get; set; }

        public int? CustomerId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public string? Status { get; set; }

        public virtual CustomerDto? Customer { get; set; }

        public List<CustomerTaskDto> Tasks { get; set; }
    }
}
