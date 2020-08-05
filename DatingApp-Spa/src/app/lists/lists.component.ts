import { Component, OnInit } from '@angular/core';
import { User } from 'src/_models/User';
import { Pagination, PaginatedResult } from 'src/_models/Pagination';
import { AuthService } from 'src/_services/auth.service';
import { AlertsService } from 'src/_services/alerts.service';
import { UserService } from 'src/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
users:User[];
pagination:Pagination;
likesParam:string;
  constructor(private authSvc:AuthService,private alertSvc:AlertsService,
            private UserSvc:UserService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.users=data['users'].result ;
      this.pagination=data['users'].pagination;
      console.log(this.pagination);
    });
    this.likesParam='Likers'
  }
  pageChanged(event: PageChangedEvent): void {
    this.pagination.currentPage=  event.page;
    this.loadUsers();
     }
  loadUsers(){
    this.UserSvc.getUsers(
     this.pagination.currentPage,
     this.pagination.itemsPerPage,
     null,
     this.likesParam
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
