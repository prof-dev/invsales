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
      username: "إداره",
      pwd: "123",
      roles:'a;',
      fullname:'الرشد محمد التوم',
      photo:'http://api.randomuser.me/portraits/men/2.jpg'
    },
    {
      id:2,
      username: "إداره عليا",
      pwd: "123",
      roles:'t;s;',
      fullname:'عيسى محمد عبد الباقي',
      photo:'http://api.randomuser.me/portraits/men/44.jpg'
    },
    {
      id:3,
      username: "أفرع",
      pwd: "123",
      roles:'s;',
      fullname:'عثمان محمد سعيد',
      photo:'http://api.randomuser.me/portraits/men/13.jpg'
    },
    {
      id:4,
      username: "مخازن",
      pwd: "123",
      roles:'b;',
      fullname:'سالم أبشر علي',
      photo:'http://api.randomuser.me/portraits/men/20.jpg'
    },
    {
      id:5,
      username: "مشاهد",
      pwd: "123",
      roles:'v;',
      fullname:'صفيه عبدالرحمن التوم',
      photo:'http://api.randomuser.me/portraits/women/50.jpg'
    },
    {
      id:6,
      username: "مستخدم",
      pwd: "123",
      roles:'u;',
      fullname:'سلوى سليم العوا',
      photo:'http://api.randomuser.me/portraits/women/72.jpg'
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
    this._hs.get('users', 'filter[]=locked,eq,0&filter[]=username,eq,' + this.user.username + '&filter[]=pwd,eq,' + this.user.pwd + '&satisfy=all')
      .subscribe(res => {
        if (res.json().users.length != 0) {
          this._ss.setAppIsBusy(false);
          var auser = res.json().users[0]
          this._ss.setUser(auser);
          this._router.navigateByUrl('/');

        } else {
          this._ss.setAppIsBusy(false);
          this._ss.setSnackBar("معلومات الدخول غير صحصحه ربما خطأ في كلمه السر أو اسم المستخدم. أو ربما تم منعك من قبل مدير النظام")
        }
      });
  }
}