using MiniERP.API.DTOs;

namespace MiniERP.API.Interfaces
{
    public interface IExternalErpService
    {
        Task<List<ExternalExchangeRateDto>> GetExchangeRatesAsync();
    }
}