using System.ComponentModel.DataAnnotations.Schema;

namespace MiniERP.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductCode { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public decimal UnitPrice { get; set; }
        public int StockQuantity { get; set; }
        public int MinimumStock { get; set; } = 5;
        public int MinStockQuantity { get; internal set; }
        public int? DepoId { get; set; }

    }
}