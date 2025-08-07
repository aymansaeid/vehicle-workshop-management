namespace vehicle_workshop_management.Server.Models
{
    public class CreateInvoiceLineDto
    {
        public int? InvoiceId { get; set; }
        public int? TaskLineId { get; set; }

        public int? InventoryId { get; set; }

        public string? Description { get; set; }

        public decimal? Quantity { get; set; }

        public decimal? UnitPrice { get; set; }

        public decimal LineTotal => (decimal)(Quantity * UnitPrice);
    }
}
