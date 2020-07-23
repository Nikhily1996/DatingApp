using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppApi.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using DatingAppApi.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Diagnostics;
using System.Net;
using Microsoft.AspNetCore.Http;

using System.Text;
using AutoMapper;
using DatingAppApi.Helper;

namespace DatingAppApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x =>
        {
            x.UseSqlite("Data Source=C:\\Development\\DatingAppApi\\mydb.db;");
        })        ;
            services.AddControllers();
            services.AddAutoMapper(typeof(DatingRepository).Assembly);
            services.AddCors();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.AddScoped<IAuthRepository,AuthRepository>();
            services.AddScoped<IDatingRepository,DatingRepository>();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
                options=>{options.TokenValidationParameters=new TokenValidationParameters{
                    ValidateIssuerSigningKey=true,
                    IssuerSigningKey=new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer=false,
                    ValidateAudience=false};
                    });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }else{
                app.UseExceptionHandler(builders=>{
                    builders.Run(async context=>{
                        context.Response.StatusCode=(int)HttpStatusCode.InternalServerError;
                        var error=context.Features.Get<IExceptionHandlerFeature>();
                        if(error!=null){
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
            }

           // app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(x=>x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
