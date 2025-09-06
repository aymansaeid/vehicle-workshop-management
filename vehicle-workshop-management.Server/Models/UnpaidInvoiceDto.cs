namespace vehicle_workshop_management.Server.Models
{
    public class UnpaidInvoiceDto
    {

        public int InvoiceID { get; set; }
        public DateTime DateIssued { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public int DaysOverdue { get; set; }
    }
}
