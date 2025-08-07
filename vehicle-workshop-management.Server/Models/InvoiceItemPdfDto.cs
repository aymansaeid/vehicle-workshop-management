namespace vehicle_workshop_management.Server.Models
{
    public class InvoiceItemPdfDto
    {
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }
    }
}
