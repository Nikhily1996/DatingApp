using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingAppApi.Data;
using Microsoft.AspNetCore.Mvc;
using DatingAppApi.Repository;
using DatingAppApi.Models;
using DatingAppApi.Dtos;
using System.Text;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;

namespace DatingAppApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController: ControllerBase
    {
        IAuthRepository _repo;
        public IConfiguration _cofing;
        public AuthController(IAuthRepository repo,IConfiguration cofing)
        {_repo=repo;
            _cofing = cofing;
            
        }
         [HttpPost("Register")]
        public async Task<IActionResult> Register( UserToRegister userToRegister )
        {
           var username=userToRegister.username.ToLower();
            if(await _repo.UserExists(username))
            return BadRequest("User already exists");

            var UserToCreate=new User{
                    UserName=username
            };
            var createdUser=await  _repo.Register(UserToCreate,userToRegister.password);
            return StatusCode(201);

        }
        [HttpPost("login")]
        
        public async Task<IActionResult> login(UserforLoginDto userforLoginDto){
           var userFromRepo= await _repo.Logging(userforLoginDto.username,userforLoginDto.password);
            if(userFromRepo==null)
            return Unauthorized();
            var Claims=new[]{
                new Claim(ClaimTypes.NameIdentifier,userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name,userFromRepo.UserName)
            };
            var Key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cofing.GetSection("AppSettings:Token").Value));
            var creds=new SigningCredentials(Key,SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor=new SecurityTokenDescriptor{
                Subject=new ClaimsIdentity(Claims),
                Expires=DateTime.Now.AddDays(1),
                SigningCredentials=creds
            };
            var tokenHandler=new JwtSecurityTokenHandler();
            var token1=tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new {token=tokenHandler.WriteToken(token1)});
        }

    }
}