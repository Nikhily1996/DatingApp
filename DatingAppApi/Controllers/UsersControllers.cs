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
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        public IDatingRepository _repo { get; }
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetUser(currentUserId);
            userParams.UserId=currentUserId;
            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender=userFromRepo.Gender.ToLower()=="female"?"male":"female";
            }
             var users = await _repo.GetUsers(userParams);
            var usersToReturn=_mapper.Map<IEnumerable<UserForListDto>>(users);
             Response.AddPagination(users.CurrentPage, users.PageSize,
                 users.TotalCount, users.TotalPages);

            return Ok(usersToReturn);
        }
        [HttpGet("{id}",Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
              var userToReturn=_mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id,UserForUpdateDto userForUpdateDto){
            if(id!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            var userFromRepo=await _repo.GetUser(id);
            _mapper.Map(userForUpdateDto,userFromRepo);
            if(await _repo.SaveAll()){
                return NoContent();
            }
            throw new Exception($"Updating User {id} Failed on Save");
        }
        [HttpPost("{id}/Like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id,int recipientId){
            if(id!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                     return Unauthorized();
            if(await _repo.GetLike(id,recipientId )!=null){
                return BadRequest("You have already liked this user");
            }
            if(await _repo.GetUser(recipientId)==null)
            return NotFound();
            Like like=new Like{
            LikerId=id,
            LikeeId=recipientId
            };
            _repo.Add(like);
            if(await _repo.SaveAll()){
                return Ok();
            }

            return BadRequest("failed to Like User");

        }
    }
}