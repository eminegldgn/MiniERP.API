namespace MiniERP.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public int MinStockQuantity { get; set; } = 5;

        public int? DepoId { get; set; }
    }


    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public int Stock { get; set; }

        public int MinStockQuantity { get; set; } = 5;

        public int? DepoId { get; set; }
    }
}