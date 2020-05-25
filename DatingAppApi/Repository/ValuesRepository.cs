using System.Threading.Tasks;
using DatingAppApi.Data;
using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using DatingAppApi.Models;

namespace DatingAppApi.Repository
{
    public class ValuesRepository
    {
        DataContext _context;
        public ValuesRepository(DataContext context )
        {
            _context=context;
        }
        public async Task<Value> getAllValues(int id){
            var result=await  _context.Values.FirstOrDefaultAsync(x=>x.Id==id);
            return result;
        }
    }
}