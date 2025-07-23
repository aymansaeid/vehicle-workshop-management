using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class InventoryGroupItem
{
    public int InventoryId { get; set; }

    public int GroupId { get; set; }

    public virtual Inventory Inventory { get; set; } = null!;
    public virtual InventoryGroup Group { get; set; } = null!;

}
