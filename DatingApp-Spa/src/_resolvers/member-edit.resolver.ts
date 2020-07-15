import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from 'src/_models/User';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/_services/auth.service';
@Injectable({
    providedIn: 'root'
  })
  export class MemberEditResolver implements Resolve<User>{
      /**
       *
       */
      constructor(private userSvc:UserService,private alertSvc:AlertsService ,private router:Router,
        private authSvc:AuthService) {
          
          
      }
    resolve(route:ActivatedRouteSnapshot): Observable<User> {
      return  this.userSvc.getUser(this.authSvc.decodedToken.nameid).pipe(
          catchError(error=>{
              this.alertSvc.error('problem in getting your details');
              this.router.navigate(['']);
              return of(null);
          })
      );
    }

  }