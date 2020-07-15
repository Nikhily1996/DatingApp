import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 baseUrl='http://localhost:5000/api/auth/';
 jwtHelperService=new JwtHelperService();
 User:any;
 decodedToken:any;
  constructor(private http:HttpClient) { }

  login(model:any){
    return this.http.post(this.baseUrl+'login',model).pipe(map((response:any)=>{
      const user=response;
      if(user){
        localStorage.setItem("token",user.token);
        this.decodedToken=this.jwtHelperService.decodeToken(user.token);
        this.User=this.decodedToken.unique_name;
       
      }
    }));
  }
  loggedin(){
    const InValidtoken=this.jwtHelperService.isTokenExpired(localStorage.getItem('token'));
    return !InValidtoken;
  }
  register(model:any){
    return this.http.post(this.baseUrl+'Register',model);
  }
}
