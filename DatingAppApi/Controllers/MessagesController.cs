using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingAppApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DatingAppApi.Repository;
using AutoMapper;
using DatingAppApi.Dtos;
using System.Security.Claims;
using DatingAppApi.Helper;
using DatingAppApi.Models;
namespace DatingAppApi.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]

    public class MessagesController: ControllerBase
    {
        public IDatingRepository _repo { get; }
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
          _mapper = mapper;
            _repo = repo;
        }
        [HttpGet("{id}",Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId,int id){
            if(userId!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();  
            var messageFromRepo=await _repo.GetMessage(id);
            if(messageFromRepo==null)
                return NotFound();
            return Ok(messageFromRepo);
        }
        [Route("thread/{recipientId}")]
        [HttpGet]
        public async Task<IActionResult> GetMessageThread(int userId,int recipientId){
             if(userId!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized(); 
           var messageFromRepo= await _repo.GetMessageThread(userId,recipientId);
           var messageThread=_mapper.Map<IEnumerable<MessageToReturnDto>>(messageFromRepo);
            return Ok(messageThread);
        }

        
        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId,[FromQuery]MessageParams messageParams){
             if(userId!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized(); 
            messageParams.UserId=userId; 
            var messageFromRepo =await _repo.GetMessagesForUser(messageParams);
            var messages=_mapper.Map<IEnumerable< MessageToReturnDto>>(messageFromRepo); 
            Response.AddPagination(messageFromRepo.CurrentPage,messageFromRepo.PageSize,
            messageFromRepo.TotalCount,messageFromRepo.TotalPages);
            return Ok(messages);
        }
        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId,MessageForCreationDto messageForCreationDto){
             if(userId!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized(); 
            var recipientId=await _repo.GetUser(messageForCreationDto.RecipientId);
            if(recipientId==null)
            return BadRequest("could not find user");

            var sender=await _repo.GetUser(messageForCreationDto.SenderId=userId);
            //automapper automatically maps recipient and sender information
            // ,since they are in memory which we are getting using getUser function
            var message=_mapper.Map<Message>(messageForCreationDto);
            _repo.Add(message);
            if(await _repo.SaveAll()){
                MessageToReturnDto messageToReturn=_mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage",new {userId=userId,id=message.Id},messageToReturn);
            }
            return BadRequest("we are not able to deliver message");

        }
         [HttpPost("{id}")]
        //we are using httppost instead of http delete 
        //because we only want to delete message when both user delete photo 
        public async Task<IActionResult> DeleteMessage(int id,int userId){
             if(userId!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized(); 
            var messageFromRepo=await _repo.GetMessage(id);
            if(messageFromRepo.SenderId==userId)
                messageFromRepo.SenderDeleted=true;
            if(messageFromRepo.RecipientId==userId)
                messageFromRepo.RecipientDeleted=true;
            if(messageFromRepo.RecipientDeleted&&messageFromRepo.SenderDeleted){
                _repo.Delete(messageFromRepo);
            }
            if(await _repo.SaveAll())
            return NoContent();

            return BadRequest("unable delete Message");
        }
        
          [HttpPost("{id}/read")]
          public async Task<IActionResult> MarkMessageAsRead(int userId,int id){
              if(userId!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized(); 
            var message=await _repo.GetMessage(id);
            if(message.RecipientId !=userId){
                return Unauthorized();
            }
            message.IsRead=true;
            message.DateRead=DateTime.Now;
            if(await _repo.SaveAll())
            return NoContent();
            
            return BadRequest("failed to update read status");
          }
         

     }
}