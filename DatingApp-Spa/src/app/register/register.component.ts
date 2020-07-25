import { Component, OnInit ,Input,Output, EventEmitter} from '@angular/core';
import { AuthService } from 'src/_services/auth.service';
import { AlertsService } from 'src/_services/alerts.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from 'src/_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
@Output() CancelRegister=new EventEmitter();
registerForm:FormGroup;
user:User;
bsConfig: Partial<BsDatepickerConfig>;
  constructor(private authSvc:AuthService,private alertSvc:AlertsService,private fb:FormBuilder,private router:Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        conformPassword: ['', Validators.required]
      },{Validators:this.passwordMatchValidator}
    );
  }
  
  
  passwordMatchValidator(g:FormGroup){
  return  g.get('password').value===g.get('conformPassword').value?null:{'mismatch':true};
  }

  register(){
    if(this.registerForm.valid){
      this.user=Object.assign({},this.registerForm.value);
      this.authSvc.register(this.user).subscribe(()=>{
        this.alertSvc.success("login successful")},
        error=>{this.alertSvc.error(error);
        this.alertSvc.confirm('there is error while registration',()=>{console.log(error)});},
        ()=>{
          this.authSvc.login(this.user).subscribe(()=>{
            this.router.navigate(['/member-list']);
          });        }
        );
    }
    
  }
  cancel(){
    this.CancelRegister.emit(false);
    this.alertSvc.message("cancelled");
  }
}
