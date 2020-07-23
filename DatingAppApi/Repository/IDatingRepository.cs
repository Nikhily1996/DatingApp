using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using DatingAppApi.Models;

namespace DatingAppApi.Repository
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T:class;
        void Delete<T>(T entity);
        Task<bool> SaveAll();

        Task<IEnumerable<User>> GetUsers();
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
    }
}