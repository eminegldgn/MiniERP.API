using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;

namespace MiniERP.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IProductRepository _productRepository;
        private readonly IPurchaseRequestRepository _purchaseRequestRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IExternalErpService _externalErpService;

        public DashboardService(
            IProductRepository productRepository,
            IPurchaseRequestRepository purchaseRequestRepository,
            IOrderRepository orderRepository,
            IExternalErpService externalErpService)
        {
            _productRepository = productRepository;
            _purchaseRequestRepository = purchaseRequestRepository;
            _orderRepository = orderRepository;
            _externalErpService = externalErpService;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync(int? depoId)
        {
           
            var products = await _productRepository.GetAllAsync(depoId);
            var requests = await _purchaseRequestRepository.GetAllAsync();
            var orders = await _orderRepository.GetAllAsync();
            var rates = await _externalErpService.GetExchangeRatesAsync();

            return new DashboardSummaryDto
            {
                TotalProducts = products.Count,
                CriticalStockCount = products.Count(p => p.StockQuantity <= p.MinimumStock),
                PendingPurchaseRequests = requests.Count(r => r.Status == "Pending"),
                TotalOrders = orders.Count,
                CompletedOrders = orders.Count(o => o.Status == "Completed"),
                TotalOrderAmount = orders.Sum(o => o.TotalAmount),
                ExchangeRates = rates
            };
        }
    }
}