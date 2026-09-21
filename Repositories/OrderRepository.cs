using Microsoft.EntityFrameworkCore;
using MiniERP.API.Data;
using MiniERP.API.Interfaces;
using MiniERP.API.Models;

namespace MiniERP.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly MiniERPDbContext _context;

        public OrderRepository(MiniERPDbContext context)
        {
            _context = context;
        }

        public async Task<List<Order>> GetAllAsync() => await _context.Orders.ToListAsync();

        public async Task<Order> GetByIdAsync(int id) => await _context.Orders.FindAsync(id);

        public async Task AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Order order)
        {
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }
    }
}