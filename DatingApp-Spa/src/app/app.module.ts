import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import {FormsModule} from '@angular/forms';
import { AuthService } from 'src/_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from 'src/_services/error-handler.service';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { DatingRoutingModule } from './dating-routing.module';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChanges } from 'src/_guards/prevent-unsaved-changes.guard';
export function tokenGetter(){
  return localStorage.getItem('token');
};
export class CustomHammerConfig extends HammerGestureConfig  {
  overrides = {
      pinch: { enable: false },
      rotate: { enable: false }
  };
}
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailComponent,
    MemberEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    DatingRoutingModule,
    NgxGalleryModule,
    JwtModule.forRoot({
     config:{
       tokenGetter:tokenGetter,
       whitelistedDomains:['localhost:5000'],
       blacklistedRoutes:['localhost:5000/api/auth']
    
    } 

    }),
    TabsModule.forRoot()
  ],
  providers: [AuthService,ErrorInterceptorProvider,
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig },
    PreventUnsavedChanges

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
