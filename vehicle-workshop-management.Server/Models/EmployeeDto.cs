namespace vehicle_workshop_management.Server.Models
{
    public class EmployeeDto
    {
        public int EmployeeId { get; set; }

        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Phone { get; set; }

        public string? Type { get; set; }

        public string? Status { get; set; }

        public DateOnly? HireDate { get; set; }

        public string? Username { get; set; }

        public DateTime? LastLogin { get; set; }

        public DateOnly? LastPresentDate { get; set; }

        public List<EmployeeTaskDto> TaskLines { get; set; }
    }
}
