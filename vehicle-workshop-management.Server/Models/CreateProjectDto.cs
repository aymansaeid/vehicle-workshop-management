namespace vehicle_workshop_management.Server.Models
{
    public class CreateProjectDto
    {
            public int? CustomerId { get; set; }
            public string? Name { get; set; }
            public string? Description { get; set; }
            public DateOnly? StartDate { get; set; }
            public DateOnly? EndDate { get; set; }
            public string? Status { get; set; }
      
    }
}
