using System.Collections.Generic;
using System.Threading.Tasks;
using DatingAppApi.Data;
using DatingAppApi.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAppApi.Repository
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
           _context.Add(entity);

        }

        public void Delete<T>(T entity)
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user=await _context.Users.Include(p=>p.Photos).FirstOrDefaultAsync(user=>user.Id==id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users=await _context.Users.Include(p=>p.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync()>0;
        }
    }
}