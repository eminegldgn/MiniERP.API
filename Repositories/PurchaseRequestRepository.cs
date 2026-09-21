using Microsoft.EntityFrameworkCore;
using MiniERP.API.Data;
using MiniERP.API.Interfaces;
using MiniERP.API.Models;

namespace MiniERP.API.Repositories
{
    public class PurchaseRequestRepository : IPurchaseRequestRepository
    {
        private readonly MiniERPDbContext _context;

        public PurchaseRequestRepository(MiniERPDbContext context)
        {
            _context = context;
        }
        public async Task<List<PurchaseRequest>> GetAllAsync()
        {
            return await _context.PurchaseRequests
                .Include(r => r.Product)
                .ToListAsync();
        }
        public async Task<PurchaseRequest> GetByIdAsync(int id)
        {
            return await _context.PurchaseRequests
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
        public async Task AddAsync(PurchaseRequest request)
        {
            _context.PurchaseRequests.Add(request);

            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(PurchaseRequest request)
        {
            _context.PurchaseRequests.Update(request);

            await _context.SaveChangesAsync();
        }
        public Task DeleteAsync(PurchaseRequest entity)
        {
            _context.PurchaseRequests.Remove(entity);

            return _context.SaveChangesAsync();
        }
    }
}