using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;

namespace MiniERP.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        // Kritik stok seviyesindeki ürünleri getiren endpoint
        [HttpGet("critical")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetCriticalProducts()
        {
            var products = await _productService.GetCriticalProductsAsync();
            return Ok(products);
        }

        [Authorize(Roles = "Admin,Inventory")]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
        {
            var createdProduct = await _productService.AddAsync(createProductDto);

            return CreatedAtAction(
                nameof(GetProduct),
                new { id = createdProduct.Id },
                createdProduct);
        }

        [Authorize(Roles = "Admin,Inventory")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDto productDto)
        {
            if (id != productDto.Id)
                return BadRequest();

            await _productService.UpdateAsync(id, productDto);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _productService.DeleteAsync(id);

            return NoContent();
        }
    }
}