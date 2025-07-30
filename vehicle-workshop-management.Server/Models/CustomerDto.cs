namespace vehicle_workshop_management.Server.Models
{
    public class CustomerDto
    {
        public int CustomerId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Type { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<CustomerCarDto> Cars { get; set; }
        public List<CustomerContactDto> Contacts { get; set; }
        public List<CustomerTaskDto> Tasks { get; set; }
    }
}
