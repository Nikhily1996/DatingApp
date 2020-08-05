import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/_models/User';
import { AuthService } from 'src/_services/auth.service';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() user:User;
  constructor(private authSvc:AuthService,private userSvc:UserService,private alertSvc:AlertsService) { }

  ngOnInit() {
  }
  sendLike(id:number){
    this.userSvc.sendLike(this.authSvc.decodedToken.nameid,id).subscribe((data)=>{
      console.log(data);
      this.alertSvc.success("You have liked "+this.user.knownAs);
    },error=>{
      console.log(error);
      this.alertSvc.error(JSON.stringify(error) );
    });
  }

}
