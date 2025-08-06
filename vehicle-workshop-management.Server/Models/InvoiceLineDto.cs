namespace vehicle_workshop_management.Server.Models
{
    public class InvoiceLineDto
    {
   
        public int LineId { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }

        public SimplifiedInventoryDto Inventory { get; set; }
        public SimplifiedTaskDto TaskLine { get; set; }
    }
}
