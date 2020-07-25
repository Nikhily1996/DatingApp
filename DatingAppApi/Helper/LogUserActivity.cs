using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingAppApi.Repository;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingAppApi.Helper
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext=await next();
            var UserId=resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var repo=resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user=await repo.GetUser(int.Parse(UserId));
            user.LastActive=DateTime.Now;
            await repo.SaveAll();
        }
    }
}