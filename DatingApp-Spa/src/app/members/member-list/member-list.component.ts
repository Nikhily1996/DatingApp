import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';
import { User } from 'src/_models/User';
import {  ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
users:User[];
  constructor(private UserSvc:UserService,private alertSvc:AlertsService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.users=data['users'];
    });
  }
}
