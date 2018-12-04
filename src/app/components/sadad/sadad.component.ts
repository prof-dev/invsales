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
  public cuss: any[] = [];
  public supp: any[] = [];
  public supcus:any;
  public sadad:any={};
  public payment: any;
  public payments: any[] = [];
  public suppcus: any[] = [];

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
  };
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
    this.getsupcusinfo();
    this.reset();
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
  private getsupcusinfo() {
    this._hs.get('suppcus')
      .subscribe(res => {
        // this.suppcus = res.json().suppcus;
        console.log(res.json());
        res.json().suppcus.forEach(element => {
          element.data = JSON.parse(element.data);
          if (element.type == 'c') {
            console.log("customeris :", element.fullname);
            this.cuss.push(element);
          }
          else if (element.type == 's') {
            this.supp.push(element);
            console.log("supplier is :", element.fullname);
          }
        });
      });
  }
  private reset(){
    this.payment = {
      paymentmethod: "",
      amount: 0.0,
      paymenttype: 5,
      checkNo: "0000",
      amountUSD: 0.00,
      rate: 0.00,
      date:""
    }
  }

  // save old balance + new balance

  public paymenttypes: Choice[] = [
    { value: 'prepayment', viewValue: 'مقدم' },
    { value: 'postpayment', viewValue: 'مؤخر' },
    { value: 'internal', viewValue: 'ترحيل خارجي' },
    { value: 'transport', viewValue: 'ترحيل داخلي' },
    { value: 'customs', viewValue: 'جمارك' }
  ];
  public paymentmethods: Choice[] = [
    { value: 'check', viewValue: 'شيك' },
    { value: 'cash', viewValue: 'كاش' }
  ];

  public checkstatus: Choice[] = [
    { value: 'clarified', viewValue: 'مظهر' },
    { value: 'new', viewValue: 'جديد' }
  ];

}
interface Choice {
  value: string;
  viewValue: string;
}
