namespace vehicle_workshop_management.Server.Models
{
    public class InventoryGroupDto
    {
        public int GroupId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public int ItemCount { get; set; }
    }
}
