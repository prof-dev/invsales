

import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';
import { ShareService } from './services/share.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public user:any=null;
  mode = new FormControl('over');

  ngOnInit(): void {
    this._ss.User.subscribe(user=>{
      this.user=user;
      console.log('user in app: ', this.user);
      
    });
  }



  constructor(private _hs:HttpService, 
    private _ss:ShareService,
    private _router:Router) { }
  
}
