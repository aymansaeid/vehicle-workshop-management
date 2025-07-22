using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class Project
{
    public int ProjectId { get; set; }

    public int? CustomerId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
