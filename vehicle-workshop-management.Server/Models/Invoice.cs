using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class Invoice
{
    public int InvoiceId { get; set; }

    public DateOnly? DateIssued { get; set; }

    public DateOnly? DueDate { get; set; }

    public decimal? TotalAmount { get; set; }

    public string? Status { get; set; }

    public string? Notes { get; set; }

    public int? CustomerId { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<InvoiceLine> InvoiceLines { get; set; } = new List<InvoiceLine>();
}
