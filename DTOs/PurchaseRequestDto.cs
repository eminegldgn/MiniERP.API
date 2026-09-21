namespace MiniERP.API.DTOs
{
    public class PurchaseRequestDto
    {
        public int Id { get; set; }
        public string RequestNo { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class CreatePurchaseRequestDto
    {
        public int ProductId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Description { get; set; }
    }
}