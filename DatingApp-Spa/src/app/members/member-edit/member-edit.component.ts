import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/_models/User';
import { AlertsService } from 'src/_services/alerts.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/_services/user.service';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm',{static:true}) editForm:NgForm;
  user:User;
  @HostListener('window:beforeunload',['$event'])
      unloadNotification($event:any){
              if(this.editForm.dirty){
                $event.returnValue=true;
              }
      }
  constructor(private router:ActivatedRoute,private alertSvc:AlertsService,
    private userSvc:UserService,private authSvc:AuthService) { }

  ngOnInit() {
    this.router.data.subscribe(data=>{
      this.user=data['user']
    })
  }
  updateUser(){
    this.userSvc.updateUser(this.authSvc.decodedToken.nameid,this.user).subscribe(
      next=>{ this.alertSvc.success('Profile updated successfully');
      this.editForm.reset(this.user);
      },error=>{
        this.alertSvc.error(error);
      }
    );
   
  }

}
