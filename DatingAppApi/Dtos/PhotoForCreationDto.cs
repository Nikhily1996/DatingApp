using System;
using Microsoft.AspNetCore.Http;

namespace DatingAppApi.Dtos
{
    public class PhotoForCreationDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
         public string Desription { get; set; }
        public DateTime DateAdded { get; set; }
       
         public string PublicId { get; set; }
       
        public PhotoForCreationDto()
        {
            DateAdded= DateTime.Now;
        }
    }
}