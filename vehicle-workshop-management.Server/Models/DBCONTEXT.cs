using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace vehicle_workshop_management.Server.Models;

public partial class DBCONTEXT : DbContext
{
    public DBCONTEXT()
    {
    }

    public DBCONTEXT(DbContextOptions<DBCONTEXT> options)
        : base(options)
    {
    }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<CustomerCar> CustomerCars { get; set; }

    public virtual DbSet<CustomerContact> CustomerContacts { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Inventory> Inventories { get; set; }

    public virtual DbSet<InventoryGroup> InventoryGroups { get; set; }

    public virtual DbSet<Invoice> Invoices { get; set; }

    public virtual DbSet<InvoiceLine> InvoiceLines { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<TaskLine> TaskLines { get; set; }

    public virtual DbSet<InventoryGroupItem> InventoryGroupItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64B80082000E");

            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Type).HasMaxLength(50);
        });

        modelBuilder.Entity<CustomerCar>(entity =>
        {
            entity.HasKey(e => e.CarId).HasName("PK__Customer__68A0340EEDF04E44");

            entity.Property(e => e.CarId).HasColumnName("CarID");
            entity.Property(e => e.Color).HasMaxLength(30);
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.EngineType).HasMaxLength(50);
            entity.Property(e => e.LicensePlate).HasMaxLength(20);
            entity.Property(e => e.Make).HasMaxLength(50);
            entity.Property(e => e.Model).HasMaxLength(50);
            entity.Property(e => e.PlateType).HasMaxLength(30);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TransmissionType).HasMaxLength(50);
            entity.Property(e => e.Vin)
                .HasMaxLength(50)
                .HasColumnName("VIN");

            entity.HasOne(d => d.Customer).WithMany(p => p.CustomerCars)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__CustomerC__Custo__5441852A");
        });

        modelBuilder.Entity<CustomerContact>(entity =>
        {
            entity.HasKey(e => e.ContactId).HasName("PK__Customer__5C6625BB9D8187A2");

            entity.Property(e => e.ContactId).HasColumnName("ContactID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Role).HasMaxLength(50);

            entity.HasOne(d => d.Customer).WithMany(p => p.CustomerContacts)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__CustomerC__Custo__5165187F");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.EmployeeId).HasName("PK__Employee__7AD04FF1A3AA87F8");

            entity.HasIndex(e => e.Username, "UQ__Employee__536C85E4EB34A3C8").IsUnique();

            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.LastLogin).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Type).HasMaxLength(50);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.HasKey(e => e.InventoryId).HasName("PK__Inventor__F5FDE6D3C564763B");

            entity.ToTable("Inventory");

            entity.Property(e => e.InventoryId).HasColumnName("InventoryID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.Type).HasMaxLength(20);
            entity.Property(e => e.Unit).HasMaxLength(20);

            entity.HasMany(d => d.Groups).WithMany(p => p.Inventories)
                .UsingEntity<Dictionary<string, object>>(
                    "InventoryGroupItem",
                    r => r.HasOne<InventoryGroup>().WithMany()
                        .HasForeignKey("GroupId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Inventory__Group__5EBF139D"),
                    l => l.HasOne<Inventory>().WithMany()
                        .HasForeignKey("InventoryId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__Inventory__Inven__5DCAEF64"),
                    j =>
                    {
                        j.HasKey("InventoryId", "GroupId").HasName("PK__Inventor__44B449E35B929BA1");
                        j.ToTable("InventoryGroupItems");
                        j.IndexerProperty<int>("InventoryId").HasColumnName("InventoryID");
                        j.IndexerProperty<int>("GroupId").HasColumnName("GroupID");
                    });
        });

        modelBuilder.Entity<InventoryGroup>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PK__Inventor__149AF30AC63FBAE0");

            entity.Property(e => e.GroupId).HasColumnName("GroupID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<InventoryGroupItem>(entity =>
        {
            entity.HasKey(e => new { e.InventoryId, e.GroupId }).HasName("PK__Inventor__44B449E35B929BA1");

            entity.Property(e => e.InventoryId).HasColumnName("InventoryID");
            entity.Property(e => e.GroupId).HasColumnName("GroupID");
        });

        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.InvoiceId).HasName("PK__Invoices__D796AAD5BBF2599D");

            entity.Property(e => e.InvoiceId).HasColumnName("InvoiceID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Notes).HasMaxLength(255);
            entity.Property(e => e.Status).HasMaxLength(50);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Customer).WithMany(p => p.Invoices)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Invoices__Custom__6EF57B66");
        });

        modelBuilder.Entity<InvoiceLine>(entity =>
        {
            entity.HasKey(e => e.LineId).HasName("PK__InvoiceL__2EAE64C977CCCE25");

            entity.Property(e => e.LineId).HasColumnName("LineID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.InventoryId).HasColumnName("InventoryID");
            entity.Property(e => e.InvoiceId).HasColumnName("InvoiceID");
            entity.Property(e => e.LineTotal).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Quantity).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TaskLineId).HasColumnName("TaskLineID");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Inventory).WithMany(p => p.InvoiceLines)
                .HasForeignKey(d => d.InventoryId)
                .HasConstraintName("FK__InvoiceLi__Inven__73BA3083");

            entity.HasOne(d => d.Invoice).WithMany(p => p.InvoiceLines)
                .HasForeignKey(d => d.InvoiceId)
                .HasConstraintName("FK__InvoiceLi__Invoi__71D1E811");

            entity.HasOne(d => d.TaskLine).WithMany(p => p.InvoiceLines)
                .HasForeignKey(d => d.TaskLineId)
                .HasConstraintName("FK__InvoiceLi__TaskL__72C60C4A");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(e => e.ProjectId).HasName("PK__Projects__761ABED0F56BCF47");

            entity.Property(e => e.ProjectId).HasColumnName("ProjectID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Status).HasMaxLength(50);

            entity.HasOne(d => d.Customer).WithMany(p => p.Projects)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Projects__Custom__619B8048");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.TaskId).HasName("PK__Tasks__7C6949D10F433A77");

            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.CarId).HasColumnName("CarID");
            entity.Property(e => e.CustomerId).HasColumnName("CustomerID");
            entity.Property(e => e.DelayReason).HasMaxLength(255);
            entity.Property(e => e.DeliveredAt).HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.EndTime).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.ProjectId).HasColumnName("ProjectID");
            entity.Property(e => e.ReceivedAt).HasColumnType("datetime");
            entity.Property(e => e.StartTime).HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .HasDefaultValue("Pending");

            entity.HasOne(d => d.Car).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.CarId)
                .HasConstraintName("FK__Tasks__CarID__66603565");

            entity.HasOne(d => d.Customer).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Tasks__CustomerI__656C112C");

            entity.HasOne(d => d.Project).WithMany(p => p.Tasks)
                .HasForeignKey(d => d.ProjectId)
                .HasConstraintName("FK__Tasks__ProjectID__6477ECF3");
        });

        modelBuilder.Entity<TaskLine>(entity =>
        {
            entity.HasKey(e => e.TaskLineId).HasName("PK__TaskLine__41E8C4635907FCEB");

            entity.Property(e => e.TaskLineId).HasColumnName("TaskLineID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.InventoryId).HasColumnName("InventoryID");
            entity.Property(e => e.LineTotal).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Quantity).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.TaskId).HasColumnName("TaskID");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Employee).WithMany(p => p.TaskLines)
                .HasForeignKey(d => d.EmployeeId)
                .HasConstraintName("FK__TaskLines__Emplo__6C190EBB");

            entity.HasOne(d => d.Inventory).WithMany(p => p.TaskLines)
                .HasForeignKey(d => d.InventoryId)
                .HasConstraintName("FK__TaskLines__Inven__6B24EA82");

            entity.HasOne(d => d.Task).WithMany(p => p.TaskLines)
                .HasForeignKey(d => d.TaskId)
                .HasConstraintName("FK__TaskLines__TaskI__6A30C649");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
