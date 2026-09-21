using MiniERP.API.DTOs;

namespace MiniERP.API.Interfaces
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllAsync();
        Task<ProductDto?> GetByIdAsync(int id);
        Task<List<ProductDto>> GetCriticalProductsAsync();
        Task<ProductDto> AddAsync(CreateProductDto createProductDto);
        Task UpdateAsync(int id, ProductDto productDto);
        Task DeleteAsync(int id);
    }
}