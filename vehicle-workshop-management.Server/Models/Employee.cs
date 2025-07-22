using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Type { get; set; }

    public string? Status { get; set; }

    public DateOnly? HireDate { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public DateTime? LastLogin { get; set; }

    public DateOnly? LastPresentDate { get; set; }

    public virtual ICollection<TaskLine> TaskLines { get; set; } = new List<TaskLine>();
}
