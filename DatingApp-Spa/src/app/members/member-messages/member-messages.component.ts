import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/_models/message';
import { AuthService } from 'src/_services/auth.service';
import { MessagesService } from 'src/_services/messages.service';
import { AlertsService } from 'src/_services/alerts.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
@Input() recipientId:number;
messages:Message[];
newMessage:any={};
  constructor(private authSvc:AuthService,private msgSvc:MessagesService,
    private alertSvc:AlertsService) { }

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages(){
    const userId=this.authSvc.CurrentUser.id;
    this.msgSvc.getMessageThread(this.authSvc.CurrentUser.id,this.recipientId).
    pipe(tap(messages=>{
      for(let i=0;i<messages.length;i++){
        if(messages[i].isRead===false&& messages[i].recipientId===userId){
          this.msgSvc.markAsRead(messages[i].id,userId);
        }
      }
    }))
    .subscribe(messages=>{
      this.messages=messages;
    },error=>{
      this.alertSvc.error(JSON.stringify(error));
    });
  }
  sendMessage(){
  this.newMessage.recipientId=this.recipientId;
  this.msgSvc.sendMessage(this.authSvc.CurrentUser.id,this.newMessage)
  .subscribe((message:Message)=>{
    this.messages.unshift(message);
    this.newMessage.content='';
  },error=>{
    this.alertSvc.error(JSON.stringify(error));
  });
  }

}
