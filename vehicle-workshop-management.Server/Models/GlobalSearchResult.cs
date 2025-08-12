namespace vehicle_workshop_management.Server.Models
{
    public class GlobalSearchResult
    {
        public List<CustomerSearchResult> Customers { get; set; } = new();
        public List<EmployeeSearchResult> Employees { get; set; } = new();
        public List<InventorySearchResult> Inventory { get; set; } = new();
    }
}
