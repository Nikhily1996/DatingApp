import { Component, OnInit } from '@angular/core';
import { User } from 'src/_models/User';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
 user:User;
 galleryOptions: NgxGalleryOptions[];
 galleryImages: NgxGalleryImage[];

  constructor(private userSvc:UserService,private alertSvc:AlertsService,private route:ActivatedRoute) { }

  ngOnInit() {
   this.route.data.subscribe(data=>{
     this.user=data['user'];
   });
   this.galleryOptions=[{
     width:'500px',
     height:'500px',
     imagePercent:100,
     thumbnailsColumns:4,
     preview:false,
     imageAnimation:NgxGalleryAnimation.Slide,
   }];
   this.galleryImages=this.getImages();
  }
  getImages(): NgxGalleryImage[] {
    const ImageUrls=[];
   for (const photo of this.user.photos) {
     ImageUrls.push({
       small:photo.url,
       medium:photo.url,
       big:photo.url,
       description:photo.description
     });
   }
   return ImageUrls;
  }
 

}
