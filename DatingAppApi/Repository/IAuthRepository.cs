using System.Threading.Tasks;
using DatingAppApi.Data;
using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using DatingAppApi.Models;
namespace DatingAppApi.Repository
{
    public interface IAuthRepository
    {
         Task<User> Register(User user,string password);
         Task<User> Logging(string user,string password);
         Task<bool> UserExists(string username);
    }
}