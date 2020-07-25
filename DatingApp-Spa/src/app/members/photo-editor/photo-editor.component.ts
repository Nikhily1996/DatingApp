import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/_models/Photo';

import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/_services/auth.service';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos:Photo[];
uploader:FileUploader;
hasBaseDropZoneOver:boolean;
baseUrl=environment.apiUrl;
currentMain:Photo;
  constructor(private AuthSvc:AuthService,private userSvc:UserService,private alertSvc:AlertsService) { }

  ngOnInit() {
    this.initilizeUploader();
  }
  initilizeUploader(){
    this.uploader = new FileUploader({
      url:this.baseUrl+'users/'+this.AuthSvc.decodedToken.nameid+'/photos' ,
      authToken:'Bearer '+localStorage.getItem('token'),
      isHTML5:true,
      autoUpload:false,
      removeAfterUpload:true,
      allowedFileType:["image"],
      maxFileSize:5*1024*1024}
    );
    this.uploader.onAfterAddingFile=(file)=>{file.withCredentials=false;};
    this.uploader.onSuccessItem=(item,response,status,headers)=>{
      if(response){
        const photo:Photo=JSON.parse(response);
        this.photos.push(photo);
        if(photo.isMain){
          this.AuthSvc.setCurrentMainPhoto(photo.url);
          this.AuthSvc.CurrentUser.photoUrl=photo.url;
          localStorage.setItem("user",JSON.stringify(this.AuthSvc.CurrentUser));
        }
      }
    };
  }
  //  maxFileSize:5*1024*1024 is 5 mb its your wish
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
  public setMainPhoto(photo:Photo){
    this.userSvc.setMainPhoto(this.AuthSvc.decodedToken.nameid,photo.id).subscribe(
      next=>{
        this.currentMain=this.photos.filter(p=>p.isMain===true)[0];
        this.currentMain.isMain=false;
        photo.isMain=true;
        this.AuthSvc.setCurrentMainPhoto(photo.url);
        this.AuthSvc.CurrentUser.photoUrl=photo.url;
        localStorage.setItem("user",JSON.stringify(this.AuthSvc.CurrentUser));
      },(error)=>{
        this.alertSvc.error(error);
      }
    );
  }


  deletePhoto(id:number){
    this.alertSvc.confirm('are you sure you want to delete photo',()=>{
      this.userSvc.deletePhoto(this.AuthSvc.decodedToken.nameid,id).subscribe(()=>{
        this.photos.splice(this.photos.findIndex(photo=>photo.id==id),1);
        this.alertSvc.success('photo has been deleted');
      },()=>{
        this.alertSvc.error('error in deleting photo');
      });
    });
  }
}
