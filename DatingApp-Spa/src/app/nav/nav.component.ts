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
  constructor(public authService:AuthService,private alertSvc:AlertsService,private router:Router) { }

  ngOnInit() {
  }
  login(){
    this.authService.login(this.model).subscribe(next=>{this.alertSvc.success('successfully logged in')},
    error=>{this.alertSvc.error(error)},()=>{this.router.navigate(['/messages']);});
  }
  loggedin(){
    return this.authService.loggedin();
  }
  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

}
