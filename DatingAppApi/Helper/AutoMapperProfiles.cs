using System.Linq;
using AutoMapper;
using DatingAppApi.Dtos;
using DatingAppApi.Models;

namespace DatingAppApi.Helper
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, opt =>
                {
                    opt.MapFrom(d => d.DateOfBirth.CalculateAge());
                });
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, opt =>
                {
                    opt.MapFrom(d => d.DateOfBirth.CalculateAge());
                });
            CreateMap<Photo, PhotosForDetailedDto>();
            CreateMap<Photo, PhotoForReturnDto>();
             CreateMap<PhotoForCreationDto,Photo>();
             CreateMap<UserToRegister,User>();
             CreateMap<MessageForCreationDto,Message>().ReverseMap();
            CreateMap<UserForUpdateDto,User>();
             CreateMap<Message,MessageToReturnDto>().ForMember(m=>m.SenderPhotoUrl,
             opt=> opt.MapFrom(u=> u.Sender.Photos.FirstOrDefault(p=>p.IsMain).Url))
             .ForMember(m=>m.RecipientPhotoUrl ,
             opt=> opt.MapFrom(u=> u.Recipient.Photos.FirstOrDefault(p=>p.IsMain).Url));
        }
    }
}