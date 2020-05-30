using System.ComponentModel.DataAnnotations;
namespace DatingAppApi.Dtos
{
    public class UserforLoginDto
    {  
        
        [Required]
        public string username { get; set; }

        [Required]
        public  string password { get; set; }
    }
}