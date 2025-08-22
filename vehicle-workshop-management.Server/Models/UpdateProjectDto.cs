namespace vehicle_workshop_management.Server.Models
{
    public class UpdateProjectDto
    {   
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateOnly? EndDate { get; set; }
        public DateOnly? startDate { get; set; }
        public string? Status { get; set; }
    }
}
