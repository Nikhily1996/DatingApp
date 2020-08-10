import { Component, OnInit } from '@angular/core';
import { Message } from 'src/_models/message';
import { Pagination, PaginatedResult } from 'src/_models/Pagination';
import { MessagesService } from 'src/_services/messages.service';
import { AuthService } from 'src/_services/auth.service';
import { AlertsService } from 'src/_services/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
messages:Message[];
pagination:Pagination;
messageContainer='unread';
  constructor(private msgSvc:MessagesService,private authSvc:AuthService,
          private alertSvc:AlertsService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.messages=data['messages'].result;
      this.pagination=data['messages'].pagination;
    });
  }
  deleteMessage(id:number){
    this.alertSvc.confirm('Are you sure you want to delete this message',
  ()=>{ this.msgSvc.deleteMessage(id, this.authSvc.decodedToken.nameid).subscribe(()=>{
    this.messages.splice(this.messages.findIndex(m=>m.id ===id),1);
    this.alertSvc.success('Message deleted');
  },
  error=>{this.alertSvc.error(error);}
  )
});
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
  loadMessages() {
    this.msgSvc
      .getMessages(
        this.authSvc.decodedToken.nameid,
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        this.messageContainer
      )
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.alertSvc.error(error);
        }
      );
  }

}
