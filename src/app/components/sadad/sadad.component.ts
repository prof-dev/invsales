import { Component, OnInit, ViewChild } from '@angular/core';
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
  public supcus = {
    id: 0,
    type: "",
    fullname: "",
    data: {},
    balance: 0
  };
  @ViewChild('date')
  public date: any;
  public sadad:any={};
  public payment: any;
  public payments: any[] = [];
  public suppcus: any[] = [];
  public paid = 0;
  public user: any;
  public check = {
    id: 0,
    checkno: "",
    bankname: "",
    date: "",
    status: "",
    checkowner: "0",
    lastholder: "",
    amount: 4,
    source: "",
    user: 0,
    comment: "",
    invoice: 0
  };
  public processinfo = {
    status: ""
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
    if(this.check.checkno!=""&&this.check.amount!=4&&this.check.bankname!=""){
      check.user=this.user.id;
      this.insertchecks();
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
  private insertchecks() {
    this.payments.forEach(element => {
      if (element.paymentmethod == "check") {
        if (element.bankname != "" && element.checkNo != "" && element.amount != 0) {
          this.check.user = this.user.id;
          this.check.bankname = element.bankname;
          this.check.checkowner = element.checkowner;
          this.check.amount = element.amount;
          this.check.checkno = element.checkno;
          this.check.date=(new Date(this.date._selected)).toISOString();
          if (this.processinfo.status == 'c') {
            this.check.source = "in";

          }
          else {
            this.check.source = "out";
          }
          this.check.status = element.checkstatus;
          this.check.status = element.checkstatus;
          console.log(this.check);
          this._hs.post('checks', this.check).subscribe(res2 => {
            this._ss.setSnackBar("تم حفظ الشيك");
          });
        }
      }
    });
  }

  updatesuppcussbalance(amount, entityid) {
    
    this.supcus.balance=this.supcus.balance+amount;
    this.supcus.data=JSON.stringify(this.supcus.data);
    this._hs.put('suppcus', "id", this.supcus).subscribe(res => {
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
    };
    this.check = {
      id: 0,
      checkno: "",
      bankname: "",
      date: "",
      status: "",
      checkowner: "0",
      lastholder: "",
      amount: 4,
      source: "",
      user: 0,
      comment: "",
      invoice: 0
    };
    this.processinfo = {
      status: ""
    };
     this.supcus = {
      id: 0,
      type: "",
      fullname: "",
      data: {},
      balance: 0
    };
  }

  editPayment(row){
    this.payment=row;
    
  }
  deletePayment(index,row){
    this.paid=Number(this.paid)-Number(row.amount);
    this.payments.splice(index,1);
    this.payment={};
  }
  pushpayment(payment) {
    this.paid = 0;
    if (payment.amount > 0) {
      this.payments.push(payment);
      this.payments.forEach(element => {
        this.paid = this.paid + Number(element.amount);
        console.log(element.amount);

        console.log("المدفووووووووووع :", this.paid);

      });
    }
    else{
      this._ss.setSnackBar("الرجاء ملء بيانات الدفع");
    }
    this.reset();

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

  forsuppliers(){
    this.reset();
    this.processinfo.status='s';
    this.sadad.source='out';
  }
  fromcustomers(){
    this.reset();
    this.processinfo.status='c';
    this.sadad.source='in';

  }
}

interface Choice {
  value: string;
  viewValue: string;
}
