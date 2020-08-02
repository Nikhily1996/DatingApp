import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/_models/User';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from 'src/_models/Pagination';
import { map } from 'rxjs/operators';

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
  getUsers(page?,itemsPerPage?,userParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult=new PaginatedResult<User[]>();
    let params=new HttpParams();
    if(page!==null && itemsPerPage!==null){
      params= params.append('pageNumber',page);
      params=  params.set('pageSize',itemsPerPage);
    }
    if(userParams){
      params= params.append('minAge',userParams.minAge);
      params= params.append('maxAge',userParams.maxAge);
      params= params.append('gender',userParams.gender);
      params= params.append('orderBy',userParams.orderBy);

    }
   
    console.log(params);
    return this.http.get<User[]>(this.baseUrl + 'users',{observe:'response',params}).
    pipe(map(response=>{
      paginatedResult.result=response.body;
      if(response.headers.get('Pagination') !=null){
        paginatedResult.pagination=JSON.parse(response.headers.get('Pagination') );
      }
      return paginatedResult;
    }));
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
