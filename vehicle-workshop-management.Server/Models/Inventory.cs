using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class Inventory
{
    public int InventoryId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public string? Type { get; set; }

    public string? Unit { get; set; }

    public decimal? Price { get; set; }

    public string? Status { get; set; }

    public virtual ICollection<InvoiceLine> InvoiceLines { get; set; } = new List<InvoiceLine>();

    public virtual ICollection<TaskLine> TaskLines { get; set; } = new List<TaskLine>();

    public virtual ICollection<InventoryGroupItem> InventoryGroupItems { get; set; } = new List<InventoryGroupItem>();

}
