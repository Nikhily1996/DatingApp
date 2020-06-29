import { Component, OnInit ,Input,Output, EventEmitter} from '@angular/core';
import { AuthService } from 'src/_services/auth.service';
import { AlertsService } from 'src/_services/alerts.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model:any={}
@Input() ValuesFormHome:any;
@Output() CancelRegister=new EventEmitter();
  constructor(private authSvc:AuthService,private alertSvc:AlertsService) { }

  ngOnInit() {
  }

  register(){
    this.authSvc.register(this.model).subscribe(()=>{this.alertSvc.success("login successful")},error=>{this.alertSvc.error(error);
    this.alertSvc.confirm('there is error while registration',()=>{console.log(error)});});
    console.log(this.model);
  }
  cancel(){
    this.CancelRegister.emit(false);
    this.alertSvc.message("cancelled");
  }
}
