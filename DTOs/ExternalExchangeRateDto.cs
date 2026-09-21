namespace MiniERP.API.DTOs
{
    public class ExternalExchangeRateDto
    {
        public string Currency { get; set; } = string.Empty;
        public decimal Rate { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}