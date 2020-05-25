using DatingAppApi.Models;
using Microsoft.EntityFrameworkCore;
namespace DatingAppApi.Data
{
    public class DataContext:DbContext
    {
        public DataContext(DbContextOptions<DataContext> options):base(options)
        {
        }
        public DbSet<Value> Values { get; set; }
    }
}