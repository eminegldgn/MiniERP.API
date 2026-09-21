namespace MiniERP.API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int RoleId { get; set; }
        public DateTime CreatedDate { get; set; }

        public Role Role { get; set; }
    }
}