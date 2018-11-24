

import { Component, OnInit } from '@angular/core';
import { HttpService } from './services/http.service';
import { ShareService } from './services/share.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  public user:any=null;
  public mode = new FormControl('side');
  public appIsBusy: {};

  ngOnInit(): void {
    this._ss.setAppIsBusy(false);
    this._ss.User.subscribe(user=>{
      this.user=user;
    });
    this._ss.SnackBar.subscribe((snack: string) => {
      if (snack && snack.length > 0) {
        this.snackBar.open(snack, 'حسناً', {
          duration: 5000,
          announcementMessage: 'Announcement !!'
        });
      }
    });
    this._ss.AppIsBusy.subscribe(busy => {
      this.appIsBusy = busy;
    });
  }

  constructor(private _hs:HttpService, 
    private _ss:ShareService,
    private _router:Router,
    private snackBar:MatSnackBar) { }


    logout() {
      this._ss.setUser({id:0});
      this._router.navigateByUrl('/');
    }
    routeTo(url) {
      this._router.navigateByUrl(url);
    }
  
}
