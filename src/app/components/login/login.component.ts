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

  public user = {
    username: "Troy",
    pwd: "123",
  }


  constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router, private _ut: UtilsService) { }
  ngOnInit() {
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