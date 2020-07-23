import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/_services/auth.service';
import { AlertsService } from 'src/_services/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model:any={};
photoUrl:string;
  constructor(public authService:AuthService,private alertSvc:AlertsService,private router:Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(url=>this.photoUrl=url);
  }
  login(){
    this.authService.login(this.model).subscribe(next=>{this.alertSvc.success('successfully logged in')},
    error=>{this.alertSvc.error(error)},()=>{this.router.navigate(['/members-list']);});
  }
  loggedin(){
    return this.authService.loggedin();
  }
  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
  }

}
