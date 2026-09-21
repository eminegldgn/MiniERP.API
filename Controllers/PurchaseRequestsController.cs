using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;
using System.Security.Claims;

namespace MiniERP.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseRequestsController : ControllerBase
    {
        private readonly IPurchaseRequestService _purchaseRequestService;

        public PurchaseRequestsController(IPurchaseRequestService purchaseRequestService)
        {
            _purchaseRequestService = purchaseRequestService;
        }
        [HttpGet]
        public async Task<ActionResult<List<PurchaseRequestDto>>> GetAll()
        {
            var requests = await _purchaseRequestService.GetAllAsync();

            return Ok(requests);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseRequestDto>> GetById(int id)
        {
            var request = await _purchaseRequestService.GetByIdAsync(id);

            if (request == null)
                return NotFound(new
                {
                    message = "Satın alma talebi bulunamadı."
                });

            return Ok(request);
        }
        [HttpPost]
        public async Task<ActionResult<PurchaseRequestDto>> Create(
            [FromBody] CreatePurchaseRequestDto createDto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    message = "Kullanıcı bilgisi bulunamadı."
                });
            }

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    message = "Geçersiz kullanıcı bilgisi."
                });
            }
            if (createDto.ProductId <= 0)
            {
                return BadRequest(new
                {
                    message = "Geçerli bir ürün seçilmelidir."
                });
            }

            if (createDto.Quantity <= 0)
            {
                return BadRequest(new
                {
                    message = "Talep miktarı 0'dan büyük olmalıdır."
                });
            }
            var result = await _purchaseRequestService.AddAsync(
    createDto,
    userId);
            return Ok(result);
        }
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var success = await _purchaseRequestService.ApproveRequestAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Onaylanacak satın alma talebi bulunamadı."
                });
            }

            return Ok(new
            {
                message = "Satın alma talebi başarıyla onaylandı."
            });
        }
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var success = await _purchaseRequestService.RejectRequestAsync(id);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Reddedilecek satın alma talebi bulunamadı."
                });
            }

            return Ok(new
            {
                message = "Satın alma talebi reddedildi."
            });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] PurchaseRequestDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest(new
                {
                    message = "Talep ID'si uyuşmuyor."
                });
            }

            await _purchaseRequestService.UpdateAsync(id, dto);

            return Ok(new
            {
                message = "Satın alma talebi güncellendi."
            });
        }
    }
}