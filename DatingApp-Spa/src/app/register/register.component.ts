import { Component, OnInit ,Input,Output, EventEmitter} from '@angular/core';
import { AuthService } from 'src/_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model:any={}
@Input() ValuesFormHome:any;
@Output() CancelRegister=new EventEmitter();
  constructor(private authSvc:AuthService) { }

  ngOnInit() {
  }

  register(){
    this.authSvc.register(this.model).subscribe(()=>{console.log("login successful")},error=>{console.log(error)});
    console.log(this.model);
  }
  cancel(){
    this.CancelRegister.emit(false);
    console.log("cancelled");
  }
}
