namespace vehicle_workshop_management.Server.Models
{
    public class InvoiceLinePdfDto
    {
        public int LineId { get; set; }

        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

        public decimal LineTotal => Quantity * UnitPrice;

        public SimplifiedInventoryDto Inventory { get; set; }
        public SimplifiedTaskDto TaskLine { get; set; }
    }
}
