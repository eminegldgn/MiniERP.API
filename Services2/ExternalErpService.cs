using MiniERP.API.DTOs;
using MiniERP.API.Interfaces;
using System.Text.Json;

namespace MiniERP.API.Services
{
    public class ExternalErpService : IExternalErpService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ExternalErpService> _logger;

        public ExternalErpService(HttpClient httpClient, ILogger<ExternalErpService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<List<ExternalExchangeRateDto>> GetExchangeRatesAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("https://api.frankfurter.app/latest?from=USD&to=EUR,TRY");

                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(content);
                    var rates = doc.RootElement.GetProperty("rates");

                    decimal usdTry = rates.GetProperty("TRY").GetDecimal();
                    decimal eurUsd = rates.GetProperty("EUR").GetDecimal();

                    
                    decimal eurTry = eurUsd > 0 ? usdTry / eurUsd : 0;

                    return new List<ExternalExchangeRateDto>
                    {
                        new ExternalExchangeRateDto
                        {
                            Currency = "TRY", 
                            Rate = usdTry,
                            LastUpdated = DateTime.UtcNow
                        },
                        new ExternalExchangeRateDto
                        {
                            Currency = "EUR", 
                            Rate = Math.Round(eurTry, 2),
                            LastUpdated = DateTime.UtcNow
                        }
                    };
                }

                _logger.LogWarning("Harici ERP API'sinden yanıt alınamadı. Durum Kodu: {StatusCode}", response.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Harici ERP entegrasyonu sırasında bir hata oluştu.");
            }

            return new List<ExternalExchangeRateDto>();
        }
    }
}