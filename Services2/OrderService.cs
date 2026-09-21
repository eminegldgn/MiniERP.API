using AutoMapper;
using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;
using MiniERP.API.Models;

namespace MiniERP.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;
        private readonly IPurchaseRequestRepository _purchaseRequestRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public OrderService(
            IOrderRepository repository,
            IPurchaseRequestRepository purchaseRequestRepository,
            IProductRepository productRepository,
            IMapper mapper)
        {
            _repository = repository;
            _purchaseRequestRepository = purchaseRequestRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<List<OrderDto>> GetAllAsync()
        {
            var orders = await _repository.GetAllAsync();
            return _mapper.Map<List<OrderDto>>(orders);
        }

        public async Task<OrderDto?> GetByIdAsync(int id)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null) return null;

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<OrderDto> AddAsync(CreateOrderDto createDto)
        {
            var order = _mapper.Map<Order>(createDto);
            order.Status = "Pending";
            order.OrderDate = DateTime.Now;

            await _repository.AddAsync(order);

            return _mapper.Map<OrderDto>(order);
        }

        public async Task<bool> CompleteOrderAsync(int id)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order == null || order.Status == "Completed")
                return false;

           
            order.Status = "Completed";
            await _repository.UpdateAsync(order);

           
            var request = await _purchaseRequestRepository.GetByIdAsync(order.PurchaseRequestId);
            if (request != null)
            {
                var product = await _productRepository.GetByIdAsync(request.ProductId);
                if (product != null)
                {
                    product.StockQuantity += request.Quantity;
                    await _productRepository.UpdateAsync(product);
                }
            }

            return true;
        }

        public async Task UpdateAsync(int id, OrderDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing != null)
            {
                _mapper.Map(dto, existing);
                await _repository.UpdateAsync(existing);
            }
        }

        public async Task DeleteAsync(int id)
        {
            var order = await _repository.GetByIdAsync(id);
            if (order != null)
            {
                await _repository.DeleteAsync(order);
            }
        }
    }
}