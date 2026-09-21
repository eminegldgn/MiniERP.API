using Microsoft.EntityFrameworkCore;
using MiniERP.API.Data;
using MiniERP.API.Interfaces;
using MiniERP.API.Models;

namespace MiniERP.API.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly MiniERPDbContext _context;

        public ProductRepository(MiniERPDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllAsync(int? depoId = null)
        {
            return await _context.Products
                .Where(p => !depoId.HasValue || p.DepoId == depoId)
                .ToListAsync();
        }

        public async Task<Product> GetByIdAsync(int id) => await _context.Products.FindAsync(id);

        public async Task AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Product product)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}