namespace vehicle_workshop_management.Server.Models
{
    public class TaskLineDto
    {
        public int TaskLineId { get; set; }
        public int TaskId { get; set; }
        public string Description { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }
        public TaskLineEmployeeDto Employee { get; set; }
        public TaskLineInventoryDto Inventory { get; set; }
    }
}
