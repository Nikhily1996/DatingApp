using System;
using System.Threading.Tasks;
using DatingAppApi.Models;
using DatingAppApi.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace DatingAppApi.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
         _context=context;   
        }

        public async Task<User> Logging(string username, string password)
        {
           var user=await _context.Users.FirstOrDefaultAsync(x=>x.UserName==username);
            if(user==null)
           return null;
           if(! verifyPasswordHash(user.Salt,user.PasswordHash,password)){
               return null;
           }
            return user;
        }
        private bool verifyPasswordHash(byte[] salt,byte[] passwordHash,string password){
            using(var hMac=new System.Security.Cryptography.HMACSHA512(salt)){
                byte[] temp=hMac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for(int i=0;i<passwordHash.Length;i++)
                {
                    if(passwordHash[i]!=temp[i])
                    return false;
                }

            }
            return true;

        }
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash,passwordSalt;
            CreatePasswordHash(password,out passwordHash,out passwordSalt);
            user.PasswordHash=passwordHash;
            user.Salt=passwordSalt;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        private void CreatePasswordHash( string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac=new System.Security.Cryptography.HMACSHA512())
                {
                    passwordSalt=hmac.Key;
                    passwordHash=hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                }
        }

        public async Task<bool> UserExists(string username)
        {
            if(await _context.Users.AnyAsync(x=>x.UserName.ToLower()==username)){
                return true;
            }
            return false;
        }
    }
}