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

namespace DatingAppApi.Controllers
{
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
        public async Task<IActionResult> GetUsers()
        {
            var users = await _repo.GetUsers();
            var usersToReturn=_mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
              var userToReturn=_mapper.Map<UserForDetailedDto>(user);
            return Ok(userToReturn);

        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id,UserForUpdateDto userForUpdateDto){
            Console.WriteLine(User);
            if(id!=Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            var userFromRepo=await _repo.GetUser(id);
            _mapper.Map(userForUpdateDto,userFromRepo);
            if(await _repo.SaveAll()){
                return NoContent();
            }
            throw new Exception($"Updating User {id} Failed on Save");
        }
    }
}