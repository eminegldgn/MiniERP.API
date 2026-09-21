using MiniERP.API.DTOs;

namespace MiniERP.API.Interfaces
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetAllAsync();
        Task<OrderDto?> GetByIdAsync(int id);
        Task<OrderDto> AddAsync(CreateOrderDto createDto);
        Task<bool> CompleteOrderAsync(int id);
        Task UpdateAsync(int id, OrderDto dto);
        Task DeleteAsync(int id);
    }
}