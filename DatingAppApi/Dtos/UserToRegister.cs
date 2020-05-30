using System.ComponentModel.DataAnnotations;
namespace DatingAppApi.Dtos
{
    public class UserToRegister
    {
        [Required]
        public string username { get; set; }

        [Required]
        [StringLength(12,MinimumLength=4,ErrorMessage="password must be of length min 4 and max 12")]
        public  string password { get; set; }
    }
}