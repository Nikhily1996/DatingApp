import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertsService } from 'src/_services/alerts.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from 'src/_models/message';
import { MessagesService } from 'src/_services/messages.service';
import { AuthService } from 'src/_services/auth.service';
@Injectable({
    providedIn: 'root'
  })
  export class MessagesResolver implements Resolve<Message[]>{
      pageNumber=1;
      pageSize=5;
      messageContainer="Unread";
      constructor(private msgSvc:MessagesService,private authSvc:AuthService,
        private alertSvc:AlertsService ,private router:Router) {
          
          
      }
    resolve(route:ActivatedRouteSnapshot): Observable<Message[]> {
      return  this.msgSvc.getMessages(this.authSvc.decodedToken.nameid ,this.pageNumber,
        this.pageSize,this.messageContainer).pipe(
          catchError(error=>{
              this.alertSvc.error('problem in getting messages');
              this.router.navigate(['/home']);
              return of(null);
          })
      );
    }

  }