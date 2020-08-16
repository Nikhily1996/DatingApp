using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppApi.Data;
using DatingAppApi.Helper;
using DatingAppApi.Models;
using Microsoft.EntityFrameworkCore;
using System;

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

        public async Task<Like> GetLike(int userId, int receptientId)
        {
         return await  _context.Likes.FirstOrDefaultAsync(u=>u.LikerId==userId&&u.LikeeId==receptientId);
        }

        public async Task<Photo> GetPhoto(int id)
        {
           var photo=await _context.Photos.FirstOrDefaultAsync(p=>p.Id==id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user=await _context.Users.FirstOrDefaultAsync(user=>user.Id==id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users= _context.Users.
            OrderByDescending(user=>user.LastActive).AsQueryable();//"Include" will add photos data into the object returned
           users=users.Where(user=>user.Id!=userParams.UserId);
           users=users.Where(user=>user.Gender.ToLower()==userParams.Gender);
           if(userParams.Likers){
               var userLikers=await GetUserLikes(userParams.UserId,userParams.Likers);
               users=users.Where(u=>userLikers.Contains(u.Id));
           }
           if(userParams.Likees){
                  var userLikees=await GetUserLikes(userParams.UserId,userParams.Likers);
                 users=users.Where(u=>userLikees.Contains(u.Id));

           }
           if(userParams.MaxAge!=99||userParams.MinAge!=18){
               var MaxDob=DateTime.Today.AddYears(-userParams.MinAge);
               var minDob =DateTime.Today.AddYears(-userParams.MaxAge-1);
               users=users.Where(user=>user.DateOfBirth<=MaxDob &&user.DateOfBirth>=minDob);
           }
           if(!String.IsNullOrEmpty(userParams.OrderBy) ){
              switch(userParams.OrderBy){
                  case "created": users= users.OrderByDescending(user=>user.Created);
                                    break;
                 default:users= users.OrderByDescending(user=>user.LastActive);
                                    break;
              } 
           }
            return await PagedList<User>.CreateAsync(users,userParams.PageNumber,userParams.PageSize);//else photoUrl will be null , it will map based on key and add data
        }
        private async Task<IEnumerable<int>> GetUserLikes(int id,bool likers){
            var user=await _context.Users
          .FirstOrDefaultAsync(u=>u.Id==id);
            if(likers){
                return user.Likers.Where(x=>x.LikeeId==id).Select(i=>i.LikerId);//select will help us to retrun 
                //what is selected or else we  will send users collection instead of int collection
            }else{
                  return user.Likees.Where(x=>x.LikerId==id).Select(i=>i.LikeeId);
            }

        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync()>0;
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.
            FirstOrDefaultAsync(m=>m.Id==id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages= _context.Messages.
           AsQueryable();
            switch(messageParams.MessageContainer){
                case "Inbox":
                messages=messages.Where(user=>user.RecipientId==messageParams.UserId
                &&user.RecipientDeleted==false);
                break;
                case "Outbox":
                messages=messages.Where(user=>user.SenderId==messageParams.UserId
                 &&user.SenderDeleted==false);
                break;
                default:
                 messages=messages.Where(user=>user.RecipientId==messageParams.UserId
                 &&user.RecipientDeleted==false&&user.IsRead==false);
                break;

            }
            messages=messages.OrderByDescending(m=>m.MessageSent);
            return await PagedList<Message>.
            CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);

        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int receptientId)
        {
              var messages= await _context.Messages.
           
            Where(u =>u.SenderId==userId&&u.SenderDeleted==false&&u.RecipientId==receptientId||
                  u.RecipientId==userId&& u.RecipientDeleted==false &&u.SenderId==receptientId).
                  OrderByDescending(m =>m.MessageSent).ToListAsync();
           return messages;
        }
    }
}