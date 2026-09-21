using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;

namespace MiniERP.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ExternalErpController : ControllerBase
    {
        private readonly IExternalErpService _externalErpService;

        public ExternalErpController(IExternalErpService externalErpService)
        {
            _externalErpService = externalErpService;
        }

        [HttpGet("exchange-rates")]
        public async Task<ActionResult<List<ExternalExchangeRateDto>>> GetExchangeRates()
        {
            var rates = await _externalErpService.GetExchangeRatesAsync();
            return Ok(rates);
        }
    }
}