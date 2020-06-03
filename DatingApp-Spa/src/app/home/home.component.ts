import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  value:any;
  registerMode:boolean=false;
  constructor(private http:HttpClient) { }
  registerToggle(){
    this.registerMode=true;
  }
  ngOnInit() {
    this.getValues();
  }
  CancelRegisterMode(value:boolean){
    this.registerMode=value;
  }
  getValues(){
    this.http.get("http://localhost:5000/api/Values").subscribe(response=>{
    this.value=response;
    },
    error=>{console.log(error);});
  }

}
