namespace vehicle_workshop_management.Server.Models
{
    public class CarServicesHistoryResponse
    {
        public int CarId { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string LicensePlate { get; set; }
        public List<ServiceHistoryDto> History { get; set; }
    }
}
