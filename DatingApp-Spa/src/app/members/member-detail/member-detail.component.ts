import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/_models/User';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static:true}) memberTabs:TabsetComponent;
 user:User;
 galleryOptions: NgxGalleryOptions[];
 galleryImages: NgxGalleryImage[];

  constructor(private userSvc:UserService,private alertSvc:AlertsService,private route:ActivatedRoute) { }

  ngOnInit() {
   this.route.data.subscribe(data=>{
     this.user=data['user'];
   });
   this.route.queryParams.subscribe(params=>{
    const selectedTab=params['tab'];
    this.memberTabs.tabs[selectedTab>0?selectedTab:0].active=true;
   })
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
  //here tabId in tabset is same as array index its ngx bootstrap data
  selectTab(tabId:number){
    this.memberTabs.tabs[tabId].active=true;
  }
 

}
