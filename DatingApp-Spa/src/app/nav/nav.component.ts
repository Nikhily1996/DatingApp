import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model:any={};
  constructor(private authService:AuthService) { }

  ngOnInit() {
  }
  login(){
    this.authService.login(this.model).subscribe(next=>{console.log('successfully logged in')},
    error=>{console.log('login failed')});
  }
  loggedin(){
    const token=localStorage.getItem('token');
    return!!token;
  }
  logOut(){
    localStorage.removeItem('token');
  }

}
