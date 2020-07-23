using AutoMapper;
using DatingAppApi.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using DatingAppApi.Helper;
using CloudinaryDotNet;
using System.Threading.Tasks;
using DatingAppApi.Dtos;
using System.Security.Claims;
using System;
using CloudinaryDotNet.Actions;
using DatingAppApi.Models;
using System.Linq;

namespace DatingAppApi.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;

        private readonly IDatingRepository _repo ;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;

        public PhotoController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
           _mapper = mapper;
            _repo = repo;
            Account account=new Account(_cloudinaryConfig.Value.CloudName,
            _cloudinaryConfig.Value.APIKey,
            _cloudinaryConfig.Value.APISecret);
            _cloudinary=new Cloudinary(account);
        }

        [HttpGet("{id}",Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id){
            var photoFromRepo=await _repo.GetPhoto(id);
            var photo=_mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
                                                         [FromForm]PhotoForCreationDto photoForCreationDto)
        {
           if(userId!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            var userFromRepo=await _repo.GetUser(userId);
            var file=photoForCreationDto.File;
            var uploadResult=new ImageUploadResult();//cloudnary object to store image result
            if(file.Length>0){
               using(var stream=file.OpenReadStream()){
                   var imageUploadParam=new ImageUploadParams(){
                       File=new FileDescription(file.Name,stream),
                       Transformation=new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                   };
                   uploadResult=_cloudinary.Upload(imageUploadParam);

               }
            }
            photoForCreationDto.Url=uploadResult.Url.ToString();
            photoForCreationDto.PublicId=uploadResult.PublicId;
            var photo=_mapper.Map<Photo>(photoForCreationDto);
            //setting photo as Main if we dont have any main photo or if its first photo
           if(!userFromRepo.Photos.Any(u=>u.IsMain)){
                photo.IsMain=true;
            }
            userFromRepo.Photos.Add(photo);
            if(await _repo.SaveAll()){
                  var photoForReturnDto=_mapper.Map<PhotoForReturnDto>(photo);//we will get id generated after storing 
                  //so we save photoForReturnDto(to get id) after we id in photo
                    return CreatedAtRoute("GetPhoto",new {id=photo.Id,userId=userId},photoForReturnDto);
            }
           return BadRequest("we are unable tosave photo");
        }
       
       //in below we are not returning details when post is successfull so we are breaking rest laws
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> setMainPhoto(int userId,int id)
        {
            if (userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(userId);
            var photoFromRepo=await _repo.GetPhoto(id);
            if (!userFromRepo.Photos.Any(photo => photo.Id == id))
                return Unauthorized();
            var currentMainPhoto=userFromRepo.Photos.FirstOrDefault(photo=>photo.IsMain==true);
            if(currentMainPhoto.Id==id)
            return BadRequest("photo is already Main");
            currentMainPhoto.IsMain=false;
             photoFromRepo.IsMain=true;
             if(await _repo.SaveAll())
             return NoContent();
             else
             return BadRequest("error while saving photo");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> deletePhoto(int id,int userId){

             if (userId != Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _repo.GetUser(userId);
            var photoFromRepo=await _repo.GetPhoto(id);
            if (!userFromRepo.Photos.Any(photo => photo.Id == id))
                return Unauthorized();
            var currentMainPhoto=userFromRepo.Photos.FirstOrDefault(photo=>photo.IsMain==true);
            if(currentMainPhoto.Id==id)
            return BadRequest("Main photo cannot be deleted ");
            
            if(photoFromRepo.PublicId==null){
                _repo.Delete(photoFromRepo);
            }else{
                var deleteParams=new DeletionParams(photoFromRepo.PublicId);
                var result=_cloudinary.Destroy(deleteParams);
                if(result.Result.ToUpper()=="OK"){
                    _repo.Delete(photoFromRepo);  
                }
            }

            if(await _repo.SaveAll())
             return Ok();
             else
             return BadRequest("error while saving photo");

        }



    }
}