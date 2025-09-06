namespace vehicle_workshop_management.Server.Models
{
    public class FinancialSummaryDto
    {
        public decimal ThisMonthRevenue { get; set; }
        public decimal LastMonthRevenue { get; set; }
        public decimal TotalOutstanding { get; set; }
        public decimal OverdueAmount { get; set; }
        public decimal MonthOverMonthGrowth => LastMonthRevenue != 0
            ? ((ThisMonthRevenue - LastMonthRevenue) / LastMonthRevenue) * 100
            : 0;
    }
}
