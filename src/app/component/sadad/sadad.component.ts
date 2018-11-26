import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from 'src/app/services/share.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sadad',
  templateUrl: './sadad.component.html',
  styleUrls: ['./sadad.component.css']
})
export class SadadComponent implements OnInit {
  public user: any;
  public check = {
    id: 0,
    checkno: "",
    bank: "",
    date: "",
    status: "",
    checkowner: "0",
    lastholder: "",
    amount: 4,
    source: "",
    user: 0,
    comment: ""
  }
  suppcus: any;
  public sadad={
    
  }
  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }

  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      }
    });
  }


  makesadad(sadad, check) {
    sadad.user=this.user.id;
    if(this.check.checkno!=""&&this.check.amount!=4&&this.check.bank!=""){
      check.user=this.user.id;
      this.savetocheck(check);
      this._hs.post('sadad', sadad).subscribe(res => {
      });
      this.updatesuppcussbalance(check.amount,sadad.entity);
    }
    else{
      this._hs.post('sadad', sadad).subscribe(res => {
      });
      this.updatesuppcussbalance(check.amount,sadad.entity);
    }
  }
  savetocheck(check) {
    this._hs.post('checks', check).subscribe(res => {this._ss.setSnackBar('تم حفظ  ' +  check.checkno + ' بنجاح');
      });
  }
  updatesuppcussbalance(amount, entityid) {
    this._hs.get('suppcus', 'filter=id,eq,entityid')
    .subscribe(res => {
        this.suppcus = res.json().suppcus;
        this.suppcus .forEach(element => {
            element.data=JSON.parse(element.data);
        });
    });
    this.suppcus[0].balance=this.suppcus[0].balance+amount;
    this._hs.put('suppcus', "id", this.suppcus[0]).subscribe(res => {
      this._ss.setSnackBar("تم تعديل رصيد العميل");
    }
    );
  }

}
