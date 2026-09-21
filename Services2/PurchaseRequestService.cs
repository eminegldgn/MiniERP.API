using AutoMapper;
using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;
using MiniERP.API.Models;

namespace MiniERP.API.Services
{
    public class PurchaseRequestService : IPurchaseRequestService
    {
        private readonly IPurchaseRequestRepository _repository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public PurchaseRequestService(
            IPurchaseRequestRepository repository,
            IProductRepository productRepository,
            IMapper mapper)
        {
            _repository = repository;
            _productRepository = productRepository;
            _mapper = mapper;
        }
        public async Task<List<PurchaseRequestDto>> GetAllAsync()
        {
            var requests = await _repository.GetAllAsync();

            return _mapper.Map<List<PurchaseRequestDto>>(requests);
        }
        public async Task<PurchaseRequestDto?> GetByIdAsync(int id)
        {
            var request = await _repository.GetByIdAsync(id);

            if (request == null)
                return null;

            return _mapper.Map<PurchaseRequestDto>(request);
        }
        public async Task<PurchaseRequestDto> AddAsync(
            CreatePurchaseRequestDto createDto,
            int requestedByUserId)
        {
            var product = await _productRepository.GetByIdAsync(createDto.ProductId);

            if (product == null)
            {
                throw new KeyNotFoundException(
                    "Satın alma talebi oluşturulmak istenen ürün bulunamadı.");
            }

    
            var request = _mapper.Map<PurchaseRequest>(createDto);


            
            request.RequestedByUserId = requestedByUserId;

            
            request.ProductId = product.Id;

           
            request.RequestNo =
                $"REQ-{DateTime.Now:yyyyMMdd-HHmmss}-{product.Id}";

           
            request.Status = "Pending";

           
            request.CreatedDate = DateTime.Now;
            request.RequestDate = DateTime.Now;

           
            request.Description = createDto.Description;

            await _repository.AddAsync(request);

            var result = _mapper.Map<PurchaseRequestDto>(request);

            result.ItemName = product.ProductName;

            return result;
        }

        public async Task<int> AutoGenerateForCriticalStockAsync()
        {
            var products = await _productRepository.GetAllAsync();

            var criticalProducts = products
                .Where(p => p.StockQuantity <= p.MinimumStock)
                .ToList();

            var existingRequests = await _repository.GetAllAsync();

            int createdCount = 0;

            foreach (var product in criticalProducts)
            {
                bool hasPendingRequest = existingRequests.Any(
                    r => r.ProductId == product.Id &&
                         r.Status == "Pending");

                if (!hasPendingRequest)
                {
                    var request = new PurchaseRequest
                    {
                        RequestNo =
                            $"REQ-{DateTime.Now:yyyyMMdd-HHmmss}-{product.Id}",

                        ProductId = product.Id,

                        Quantity =
                            Math.Max(product.MinimumStock * 2, 10),

                        CreatedDate = DateTime.Now,
                        RequestDate = DateTime.Now,

                        Status = "Pending",

                        Description =
                            $"Stok seviyesi kritik sınırın " +
                            $"({product.MinimumStock}) altına düştü. " +
                            $"Otomatik sistem talebi."
                    };

                    await _repository.AddAsync(request);

                    createdCount++;
                }
            }

            return createdCount;
        }

       
        public async Task<bool> ApproveRequestAsync(int id)
        {
            var request = await _repository.GetByIdAsync(id);

            if (request == null)
                return false;

            request.Status = "Approved";

            await _repository.UpdateAsync(request);

            return true;
        }

        public async Task<bool> RejectRequestAsync(int id)
        {
            var request = await _repository.GetByIdAsync(id);

            if (request == null)
                return false;

            request.Status = "Rejected";

            await _repository.UpdateAsync(request);

            return true;
        }

       
        public async Task UpdateAsync(
            int id,
            PurchaseRequestDto dto)
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
            var request = await _repository.GetByIdAsync(id);

            if (request != null)
            {
                await _repository.DeleteAsync(request);
            }
        }
    }
}