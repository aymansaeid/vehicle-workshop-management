namespace vehicle_workshop_management.Server.Models
{
    public class CreateTaskDto
    {
        public int? ProjectId { get; set; }
        public int? CustomerId { get; set; }
        public int? CarId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
