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
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from 'src/_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from 'src/_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from 'src/_resolvers/lists.resolver';

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
    {path:'members/edit', component:MemberEditComponent,
    resolve:{
      user:MemberEditResolver
    },canDeactivate:[PreventUnsavedChanges]},
    {path:'members/:id', component:MemberDetailComponent,
    resolve:{
      user:MemberDetailResolver
    }},
    {path:'lists', component:ListsComponent,resolve:{
      users:ListsResolver
    }}
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
