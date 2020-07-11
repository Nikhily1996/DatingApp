import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuardGuard } from 'src/_guards/auth-guard.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from 'src/_resolvers/member-details.resolver';
import { MemberListResolver } from 'src/_resolvers/member-list.resolver';

const routes:Routes=[
  {path:'', component:HomeComponent},
  {path:'',
  runGuardsAndResolvers:'always',
  canActivate:[AuthGuardGuard],
  children:[
    {path:'messages', component:MessagesComponent},
    {path:'member-list', component:MemberListComponent,
    resolve:{
      users:MemberListResolver
    }},
    {path:'members/:id', component:MemberDetailComponent,
    resolve:{
      user:MemberDetailResolver
    }},
    {path:'lists', component:ListsComponent}
  ]}
  ,
  {path:'**', redirectTo:'',pathMatch:'full'}

];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class DatingRoutingModule { }
