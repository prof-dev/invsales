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

  public users = [
    {
      id: 1,
      username: "admin",
      pwd: "123",
      roles: 'a;t;v;u;b;s;',
      namear: 'الرشد محمد التوم',
      photo: 'http://api.randomuser.me/portraits/men/2.jpg',
      stores:[61,74]
    },
    {
      id: 2,
      username: "إداره عليا",
      pwd: "123",
      roles: 't;s;',
      namear: 'عيسى محمد عبد الباقي',
      photo: 'http://api.randomuser.me/portraits/men/44.jpg'
    },
    {
      id: 3,
      username: "أفرع",
      pwd: "123",
      roles: 'b;',
      namear: 'عثمان محمد سعيد',
      photo: 'http://api.randomuser.me/portraits/men/13.jpg'
    },
    {
      id: 4,
      username: "مخازن",
      pwd: "123",
      roles: 's;',
      namear: 'سالم أبشر علي',
      photo: 'http://api.randomuser.me/portraits/men/20.jpg'
    },
    {
      id: 5,
      username: "مشاهد",
      pwd: "123",
      roles: 'v;',
      namear: 'صفيه عبدالرحمن التوم',
      photo: 'http://api.randomuser.me/portraits/women/50.jpg'
    },
    {
      id: 6,
      username: "مستخدم",
      pwd: "123",
      roles: 'u;',
      namear: 'سلوى سليم العوا',
      photo: 'http://api.randomuser.me/portraits/women/72.jpg'
    }
  ];

  public user = this.users[0];
  constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router, private _ut: UtilsService) { }
  ngOnInit() {
  }
  fastLogin(user) {
    this._ss.setUser(user);
    this._router.navigateByUrl('/');
  }
  login() {
    this._ss.setAppIsBusy(true);
    this._hs.get('users','satisfy=all&filter[]=username,eq,' + this.user.username + '&filter[]=pwd,eq,' + this.user.pwd )
      .subscribe(res => {
        if (res.json().users[0].id>0) {
          this._ss.setAppIsBusy(false);
          var auser = res.json().users[0];
          this._ss.setUser(auser);
          this._router.navigateByUrl('/');
        } else {
          this._ss.setAppIsBusy(false);
          this._ss.setSnackBar("معلومات الدخول غير صحصحه ربما خطأ في كلمه السر أو اسم المستخدم. أو ربما تم منعك من قبل مدير النظام")
        }
      });
  }

authlogin(){
  this._ss.setAppIsBusy(true);
  this._hs._http.get(this._hs.APISERVER+'login.php?type=login&username=' + this.user.username + '&pwd=' + this.user.pwd )
    .subscribe(res => {
      console.log('user is: ', res.json());
      if (res.json().id>0) {
        this._ss.setAppIsBusy(false);
        var auser = res.json();
        this._ss.setUser(auser);
        this._router.navigateByUrl('/');
      } else {
        this._ss.setAppIsBusy(false);
        this._ss.setSnackBar("معلومات الدخول غير صحصحه ربما خطأ في كلمه السر أو اسم المستخدم. أو ربما تم منعك من قبل مدير النظام")
      }
    });

}

}