import { Component, OnInit, Input } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public users=[
    {
      id:1,
      username: "Admin",
      pwd: "123",
      roles:'a;',
      fullname:'Mr Administrator'
    },
    {
      id:2,
      username: "TopAdmin",
      pwd: "123",
      roles:'t;',
      fullname:'Mr Top Administrator'
    },
    {
      id:3,
      username: "Stores",
      pwd: "123",
      roles:'s;',
      fullname:'Mr Stores Man'
    },
    {
      id:4,
      username: "Branches",
      pwd: "123",
      roles:'b;',
      fullname:'Mr Branches Man'
    },
    {
      id:1,
      username: "Viewer",
      pwd: "123",
      roles:'v;',
      fullname:'Mr Viewer Man'
    }
  ];

  public user = this.users[0];
  constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router, private _ut: UtilsService) { }
  ngOnInit() {
  }
  fastLogin(user){
    this._ss.setUser(user);
    this._router.navigateByUrl('/');
  }
  login() {
    this._ss.setAppIsBusy(true);
    this._hs.get('users', 'filter[]=username,eq,' + this.user.username + '&filter[]=pwd,eq,' + this.user.pwd + '&satisfy=all')
      .subscribe(res => {
        if (res.json().users.length != 0) {
          var auser = res.json().users[0]
          this._ss.setUser(auser);
          this._router.navigateByUrl('/');
          this._ss.setAppIsBusy(false);

        } else {
          this._ss.setSnackBar("We could not log you in!")
          this._ss.setAppIsBusy(false);
        }
      });
  }
  showD() {

    this._ut.messageBox('input', 'what is your name', 'Please tell the truth and enter your name', 'Your name')
      .afterClosed()
      .subscribe(result => {
        if (result == 'ok') {
          console.log('res: ', this._ut.thedata.result);
        }
      });
  }
}