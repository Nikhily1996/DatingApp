import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';
import { User } from 'src/_models/User';
import {  ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/_models/Pagination';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
users:User[];
user:User=JSON.parse(localStorage.getItem('user'));
genderList=[{value:'male',display:'Males'},{value:'female',display:'Female'}];
userParams:any={};
pagination:Pagination;
  constructor(private UserSvc:UserService,private alertSvc:AlertsService,private route:ActivatedRoute) { }
  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.users=data['users'].result ;
      this.pagination=data['users'].pagination;
      console.log(this.pagination);
    });
    this.userParams.gender= this.user.gender==='female'?'male':'female';
    this.userParams.minAge=18;
    this.userParams.maxAge=99;
    this.userParams.orderBy='lastActive';
  }
  pageChanged(event: PageChangedEvent): void {
  this.pagination.currentPage=  event.page;
  this.loadUsers();
   }
   resetFilters(){
    this.userParams.gender= this.user.gender==='female'?'male':'female';
    this.userParams.minAge=18;
    this.userParams.maxAge=99;
    this.loadUsers();
   }
   loadUsers(){
     this.UserSvc.getUsers(
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.userParams
    ).subscribe(
       (res:PaginatedResult<User[]>)=>{
        this.users=res.result;
        this.pagination=res.pagination;
       },(error)=>{
         this.alertSvc.error(error);
       }
     )
   }
}
