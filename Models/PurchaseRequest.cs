namespace MiniERP.API.Models
{
    public class PurchaseRequest
    {
        public int Id { get; set; }
        public string RequestNo { get; set; } = string.Empty;
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime RequestDate { get; set; } = DateTime.Now;

        public int RequestedByUserId { get; set; }
        public User? RequestedByUser { get; set; }

        public string Status { get; set; } = "Pending";
        public string? Description { get; set; }
        public string? RejectionReason { get; set; }
    }
}