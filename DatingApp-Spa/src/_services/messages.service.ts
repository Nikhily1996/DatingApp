import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginatedResult } from 'src/_models/Pagination';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Message } from 'src/_models/message';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;
 
  constructor(private http:HttpClient) { }
  getMessages(id:number,page?,itemsPerPage?,messageContainer?){
    const paginatedResult:PaginatedResult<Message[]>=new PaginatedResult<Message[]>();
    let params=new HttpParams();
    params=params.append("MessageContainer",messageContainer);
    if(page!==null && itemsPerPage!==null){
      params= params.append('pageNumber',page);
      params=  params.set('pageSize',itemsPerPage);
    }
    return this.http.get<Message[]>(this.baseUrl + 'users/'+id+'/messages',{observe:'response',params}).
    pipe(map(response=>{
      paginatedResult.result=response.body;
      if(response.headers.get('Pagination') !=null){
        paginatedResult.pagination=JSON.parse(response.headers.get('Pagination') );
      }
      return paginatedResult;
    }));
  }
  getMessageThread(id:number,recipientId:number){
      return this.http.get<Message[]>(this.baseUrl+'users/'+id+'/messages/thread/'+recipientId);
  }
  sendMessage(id:number,message:Message){
    return this.http.post(this.baseUrl+'users/'+id+'/messages',message);
  }
  deleteMessage(id:number,userId:number){
    return this.http.post(this.baseUrl+'users/'+userId+'/messages/'+id,{});
  }
  markAsRead(id:number,userId:number){
    return this.http.post(this.baseUrl+'users/'+userId+'/messages/'+id+'/read',{}).subscribe();
  }
}
