using Microsoft.EntityFrameworkCore;
using MiniERP.API.Models;

namespace MiniERP.API.Data
{
    public class MiniERPDbContext : DbContext
    {
        public MiniERPDbContext(DbContextOptions<MiniERPDbContext> options)
            : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<PurchaseRequest> PurchaseRequests { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<StockTransaction> StockTransactions { get; set; }
    }
}