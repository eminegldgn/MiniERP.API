namespace MiniERP.API.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalProducts { get; set; }
        public int CriticalStockCount { get; set; }
        public int PendingPurchaseRequests { get; set; }
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public decimal TotalOrderAmount { get; set; }
        public List<ExternalExchangeRateDto> ExchangeRates { get; set; } = new();
    }
}