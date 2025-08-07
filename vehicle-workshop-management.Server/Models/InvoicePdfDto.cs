namespace vehicle_workshop_management.Server.Models
{
    public class InvoicePdfDto
    {
        public int InvoiceId { get; set; }
        public string FormattedDate { get; set; }
        public string FormattedDueDate { get; set; }
        public string Status { get; set; }
        public string CustomerName { get; set; }
        public List<InvoiceItemPdfDto> InvoiceLines { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal CalculatedTotal { get; set; } // For verification
        public string Notes { get; set; }
    }
}
