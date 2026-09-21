using MiniERP.API.Models;

namespace MiniERP.API.Interfaces
{
    public interface IPurchaseRequestRepository
    {
        Task<List<PurchaseRequest>> GetAllAsync();
        Task<PurchaseRequest> GetByIdAsync(int id);
        Task AddAsync(PurchaseRequest request);
        Task UpdateAsync(PurchaseRequest request);
        Task DeleteAsync(PurchaseRequest entity);

    }
}