namespace MiniERP.API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNo { get; set; } = string.Empty;
        public int PurchaseRequestId { get; set; }
        public int SupplierId { get; set; }
        public string? SupplierName { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime OrderDate { get; set; }
    }

    public class CreateOrderDto
    {
        public string OrderNo { get; set; } = string.Empty;
        public int PurchaseRequestId { get; set; }
        public int SupplierId { get; set; }
        public decimal TotalAmount { get; set; }
    }
}