import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  public user={
    email:"",
    password:""
  }
  constructor(private _ss:ShareService, private _hs:HttpService) { }
  ngOnInit() {
  }

  // login(){
  //   this._hs.get('users', 'filter[]=email,eq,'+this.user.email+'&filter[]=password,eq,'+this.user.password+'&satisfy=all')
  //     .subscribe(user=>{
  //       this._ss.setUser(user.json());
  //     });
  // }
}