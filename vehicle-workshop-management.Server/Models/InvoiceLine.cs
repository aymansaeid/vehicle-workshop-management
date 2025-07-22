using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class InvoiceLine
{
    public int LineId { get; set; }

    public int? InvoiceId { get; set; }

    public int? TaskLineId { get; set; }

    public int? InventoryId { get; set; }

    public string? Description { get; set; }

    public decimal? Quantity { get; set; }

    public decimal? UnitPrice { get; set; }

    public decimal? LineTotal { get; set; }

    public virtual Inventory? Inventory { get; set; }

    public virtual Invoice? Invoice { get; set; }

    public virtual TaskLine? TaskLine { get; set; }
}
