using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppApi.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace DatingAppApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
          var host= CreateHostBuilder(args).Build();
          using(var scope=host.Services.CreateScope()){
              var Services=scope.ServiceProvider;
              try{
                  var context=Services.GetRequiredService<DataContext>();
                  context.Database.Migrate();//create db if it does not exist
                 // Seed.SeedUsers(context);
                  
              }catch(Exception e){
                  var logger=Services.GetRequiredService<ILogger<Program>>();
                  logger.LogError(e,"An error occured during migrations");

              }
          }
          host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
