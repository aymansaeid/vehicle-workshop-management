using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class InventoryGroup
{
    public int GroupId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<InventoryGroupItem> InventoryGroupItems { get; set; } = new List<InventoryGroupItem>();

}
