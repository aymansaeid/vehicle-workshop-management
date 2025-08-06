namespace vehicle_workshop_management.Server.Models
{
    public class UpdateInvoiceDto
    {
        public DateOnly? DateIssued { get; set; }

        public DateOnly? DueDate { get; set; }

        public decimal? TotalAmount { get; set; }

        public string? Status { get; set; }

        public string? Notes { get; set; }

        public int? CustomerId { get; set; }
    }
}
