import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/_services/auth.service';
import { AlertsService } from 'src/_services/alerts.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private authSvc:AuthService,private router:Router,private alertSvc:AlertsService){}
  canActivate(
   ):  boolean {
     if(this.authSvc.loggedin()){
       return true;
     }
    this.router.navigate(['/home']);
    this.alertSvc.error('You Dont have access');
    return false;
  }
  
}
