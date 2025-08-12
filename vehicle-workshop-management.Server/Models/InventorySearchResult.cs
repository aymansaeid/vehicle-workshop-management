namespace vehicle_workshop_management.Server.Models
{
    public class InventorySearchResult
    {
        public int InventoryId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public decimal Price { get; set; }
        public string? Status { get; set; }
    }
}
