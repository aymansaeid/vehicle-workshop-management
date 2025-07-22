using System;
using System.Collections.Generic;

namespace vehicle_workshop_management.Server.Models;

public partial class CustomerCar
{
    public int CarId { get; set; }

    public int? CustomerId { get; set; }

    public string? LicensePlate { get; set; }

    public string? PlateType { get; set; }

    public string? Make { get; set; }

    public string? Model { get; set; }

    public int? Year { get; set; }

    public string? Vin { get; set; }

    public string? Color { get; set; }

    public string? EngineType { get; set; }

    public string? TransmissionType { get; set; }

    public string? Status { get; set; }

    public DateOnly? WarrantyStartDate { get; set; }

    public DateOnly? WarrantyEndDate { get; set; }

    public int? WarrantyMaxMileage { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual ICollection<Task> Tasks { get; set; } = new List<Task>();
}
