namespace vehicle_workshop_management.Server.Models
{
    public class EmployeeTaskDto
    {
        public int TaskLineId { get; set; }
        public int TaskId { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string DelayReason { get; set; }
    }
}
