namespace vehicle_workshop_management.Server.Models
{
    public class InvoiceDto
    {
        public int InvoiceId { get; set; }

        public DateOnly? DateIssued { get; set; }

        public DateOnly? DueDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public string? Status { get; set; }

        public string? Notes { get; set; }

        public int? CustomerId { get; set; }
      

    }
}
