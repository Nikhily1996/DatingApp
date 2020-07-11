import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from 'src/_models/User';
import { UserService } from 'src/_services/user.service';
import { AlertsService } from 'src/_services/alerts.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })
  export class MemberListResolver implements Resolve<User[]>{
      /**
       *
       */
      constructor(private userSvc:UserService,private alertSvc:AlertsService ,private router:Router) {
          
          
      }
    resolve(route:ActivatedRouteSnapshot): Observable<User[]> {
      return  this.userSvc.getUsers().pipe(
          catchError(error=>{
              this.alertSvc.error('problem in getting member list');
              this.router.navigate(['/list']);
              return of(null);
          })
      );
    }

  }