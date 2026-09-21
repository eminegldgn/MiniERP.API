using MiniERP.API.Models;

namespace MiniERP.API.Interfaces
{
    public interface IProductRepository
    {
        Task<List<Product>> GetAllAsync(int? depoId = null);
        Task<Product> GetByIdAsync(int id);
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(Product product);
    }
}