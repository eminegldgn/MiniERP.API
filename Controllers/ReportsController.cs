using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniERP.API.Data;

namespace MiniERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly MiniERPDbContext _context;

        public ReportsController(MiniERPDbContext context)
        {
            _context = context;
        }

        [HttpGet("low-stock")]
        public async Task<IActionResult> LowStock()
        {
            var result = await _context.Products
                .Where(x => x.StockQuantity <= x.MinimumStock)
                .ToListAsync();

            return Ok(result);
        }
    }
}