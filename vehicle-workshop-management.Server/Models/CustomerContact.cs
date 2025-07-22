using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class CustomerContact
{
    public int ContactId { get; set; }

    public int? CustomerId { get; set; }

    public string? Name { get; set; }

    public string? Role { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public virtual Customer? Customer { get; set; }
}
