import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public userExtra = {
    pwdnu: '',
    pwdco: '',
    pwdcu: '',

  }
  public user: any={id:0};
  constructor(private _ss: ShareService, private _hs: HttpService, private _rt:Router) { }

  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
    });
    if (this.user.id==0){
      this._rt.navigateByUrl('/login');
    }
  }
  save() {
    if (this.userExtra.pwdcu != this.user.pwd) {
      this._ss.setSnackBar('كلمة السر غير صحيحه');
      return;
    }
    if (this.userExtra.pwdnu.length > 0 && this.userExtra.pwdnu != this.userExtra.pwdco) {
      this._ss.setSnackBar('كلمتا السر لا تتطابقان');
      return;
    }

    if (this.userExtra.pwdnu.length>0){
      this.user.pwd= this.userExtra.pwdnu;
    }
    this._hs.put('users', 'id', this.user).subscribe(res=>{
      if (res.json()==1){
        this._ss.setSnackBar('تم حفظ إعداداتي بنجاح');
      }else{
        this._ss.setSnackBar('لم يتم حفظ إعداداتي بنجاح');
      }
    });
  }
}
