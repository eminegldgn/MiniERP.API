using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;

namespace MiniERP.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _orderService.GetByIdAsync(id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [Authorize(Roles = "Admin,Procurement")]
        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto createDto)
        {
            var created = await _orderService.AddAsync(createDto);

            return CreatedAtAction(
                nameof(GetOrder),
                new { id = created.Id },
                created);
        }
        [Authorize(Roles = "Admin,Procurement,Inventory")]
        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var result = await _orderService.CompleteOrderAsync(id);
            if (!result)
                return BadRequest(new { Message = "Sipariş bulunamadı veya zaten tamamlanmış." });

            return NoContent();
        }

        [Authorize(Roles = "Admin,Procurement")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, OrderDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            await _orderService.UpdateAsync(id, dto);

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            await _orderService.DeleteAsync(id);

            return NoContent();
        }
    }
}