import { Component,OnInit} from '@angular/core';
import { AuthService } from 'src/_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelperService=new JwtHelperService();
constructor(private authSvc:AuthService){

}
  ngOnInit(): void {
    this.authSvc.User=this.jwtHelperService.decodeToken(
      localStorage.getItem("token")).unique_name;
  }
  
}
