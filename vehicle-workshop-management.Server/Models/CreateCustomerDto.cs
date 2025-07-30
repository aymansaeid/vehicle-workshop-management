namespace vehicle_workshop_management.Server.Models
{
    public class CreateCustomerDto
    {

        public string? Name { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Type { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
