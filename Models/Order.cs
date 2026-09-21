namespace MiniERP.API.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNo { get; set; } = string.Empty;
        public int PurchaseRequestId { get; set; }
        public PurchaseRequest? PurchaseRequest { get; set; }
        public int SupplierId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "Pending";
    }
}