namespace vehicle_workshop_management.Server.Models
{
    public class CreateInventoryDto
    {
        public string? Name { get; set; }

        public string? Description { get; set; }

        public string? Type { get; set; }

        public string? Unit { get; set; }

        public decimal? Price { get; set; }

        public string? Status { get; set; }
        public int? GroupIds { get; set; }  // For POST/PUT


    }
}
