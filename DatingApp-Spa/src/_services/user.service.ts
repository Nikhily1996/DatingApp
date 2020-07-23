import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/_models/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
 
  constructor(private http:HttpClient) { }
  getUser(id): Observable<User> {
    console.log('getting details of user id'+id);
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users');
  }
  updateUser(id:number,user:User){
    return this.http.put(this.baseUrl+'users/'+id,user);
  }
  setMainPhoto(userid:number,photoid:number){
    console.error(userid+'  '+photoid);
    return this.http.post(this.baseUrl+'users/'+userid+'/photos/'+photoid+'/setMain',{});
  }
  deletePhoto(userid:number,photoid:number){
    return this.http.delete(this.baseUrl+'users/'+userid+'/photos/'+photoid);
  }
}
