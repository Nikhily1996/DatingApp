import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { User } from 'src/_models/User';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 baseUrl='http://localhost:5000/api/auth/';
 jwtHelperService=new JwtHelperService();
 decodedToken:any;
 CurrentUser:User;
 photoUrl$=new BehaviorSubject<string>('../../assets/userIcon.png');
 currentPhotoUrl=this.photoUrl$.asObservable();
  constructor(private http:HttpClient) { }
  
  setCurrentMainPhoto(photoUrl:string){
    this.photoUrl$.next(photoUrl);
  }
  login(model:any){
    return this.http.post(this.baseUrl+'login',model).pipe(map((response:any)=>{
      const user=response;
      if(user){
        localStorage.setItem("token",user.token);
        localStorage.setItem("user",JSON.stringify( user.userToReturn));
        this.decodedToken=this.jwtHelperService.decodeToken(user.token);
       this.CurrentUser=user.userToReturn;
       this.photoUrl$.next(this.CurrentUser.photoUrl);
      }
    }));
  }
  loggedin(){
    const InValidtoken=this.jwtHelperService.isTokenExpired(localStorage.getItem('token'));
    return !InValidtoken;
  }
  register(model:User){
    return this.http.post(this.baseUrl+'Register',model);
  }
}
