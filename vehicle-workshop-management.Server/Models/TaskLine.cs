using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class TaskLine
{
    public int TaskLineId { get; set; }

    public int? TaskId { get; set; }

    public int? InventoryId { get; set; }

    public int? EmployeeId { get; set; }

    public decimal? Quantity { get; set; }

    public string? Description { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? LineTotal { get; set; }

    public virtual Employee? Employee { get; set; }

    public virtual Inventory? Inventory { get; set; }

    public virtual ICollection<InvoiceLine> InvoiceLines { get; set; } = new List<InvoiceLine>();

    public virtual Task? Task { get; set; }
}
