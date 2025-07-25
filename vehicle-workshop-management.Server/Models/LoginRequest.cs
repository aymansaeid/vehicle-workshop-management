namespace vehicle_workshop_management.Server.Models
{
    public class LoginRequest
    {
        public int EmployeeId { get; set; }


        public string? Username { get; set; }
        public string? Password { get; set; }

        public string? Type { get; set; }

        public DateTime? LastLogin { get; set; }



    }
}
