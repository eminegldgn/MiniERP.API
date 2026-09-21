using MiniERP.API.DTOs;

namespace MiniERP.API.Interfaces
{
    public interface IPurchaseRequestService
    {
        Task<List<PurchaseRequestDto>> GetAllAsync();
        Task<PurchaseRequestDto?> GetByIdAsync(int id);
        Task<PurchaseRequestDto> AddAsync(
            CreatePurchaseRequestDto createDto,
            int requestedByUserId);

        Task<int> AutoGenerateForCriticalStockAsync();
        Task<bool> ApproveRequestAsync(int id);
        Task<bool> RejectRequestAsync(int id);
        Task UpdateAsync(int id, PurchaseRequestDto dto);
        Task DeleteAsync(int id);
    }
}