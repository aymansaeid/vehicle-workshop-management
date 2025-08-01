namespace vehicle_workshop_management.Server.Models
{
    public class UpdateTaskLineDto
    {
        public int? InventoryId { get; set; }

        public int? EmployeeId { get; set; }

        public decimal? Quantity { get; set; }

        public string? Description { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal? LineTotal { get; set; }
    }
}
