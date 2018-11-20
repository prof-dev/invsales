

import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';
import { ShareService } from './services/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public user:any=null;

  ngOnInit(): void {
    this._ss.User.subscribe(user=>{
      this.user=user;
      console.log('user in app: ', this.user);
      
    });
  }

  logout(){

    this._ss.setUser({id:0});
    this._router.navigateByUrl('/login');
  }



  constructor(private _hs:HttpService, 
    private _ss:ShareService,
    private _router:Router) { }


    
  
}
