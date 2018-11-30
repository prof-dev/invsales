import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { fadeInItems, DateAdapter } from '@angular/material';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  myControl = new FormControl();
  public supp: any[] = [];
  public cuss: any[] = [];
  public productsview: any[] = [];
  public lookups: any[] = [];
  public filteringtype = "";
  public optionids: any[] = [];
  public filteredOptions: Observable<any[]>;
  public user: any;
  public invoice = {
    type: "",
    data: {},
    id: 0,
    shipno: "",
    totalprice: 0,
    entityid: 0,
    user: 0


  }
  public invoiceitems: any[] = [];
  public data: any;
  public items: any[] = [];
  public showiteminsert: boolean;
  public item: any;
  public payment: any;
  public payments: any[] = [];
  public suppcus: any[] = [];
  public processinfo = {
    reminder: 0,
    status: ""
  };
  public selecteditem = {
    id: 0,
    type: "",
    fullname: "",
    data: {},
    balance: 0
  };
  public product: any = {};
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

  public inventory = {
    id: 0,
    data: [],
  }



  public operation: string = "";
  store: any;
  stores: any[] = [];
  public storeselect: any[] = [];
  invoicedata: { payments: any[]; items: any[]; };
  public invoiceid = 0;
  public paid = 0;



  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }


  ngOnInit() {

    this.refresh();
    this.getallstores();
    console.log(this.user.id);
    


    this.data = {

    }
    this.item = {
      item: 0,
      category: 0,
      quantity: 0,
      total: 55.55,
      price: 0

    }

    this.payment = {
      paymentmethod: "",
      amount: 0.0,
      paymenttype: 5,
      checkNo: "0000",
      amountUSD: 0.00,
      rate: 0.00
    }


  }

  private getallstores() {
    this._hs.get('lookups', 'filter=group,eq,stores')
      .subscribe(res => {
        this.store = res.json().lookups[0];
        console.log(this.store);
        this._hs.get('lookups', 'filter[]=parent,eq,' + this.store.id)
          .subscribe(res => {
            this.stores = res.json().lookups;
            this.storeselect = this.stores.map(stores => ({ id: stores.id, titlear: stores.titlear }));
            console.log(this.storeselect);
          });
      });
  }

  private refresh() {
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      }
      else {
        this._hs.get('lookups', 'filter=group,eq,item')
          .subscribe(res => {
            this.lookups = res.json().lookups;
            console.log(this.lookups);
            this.lookups.forEach(element => {
              element.data = JSON.parse(element.data);
              console.log(this.items);
            });
            this.productsview = this.lookups.map(lookup => ({ id: lookup.id, titlear: lookup.titlear, price: lookup.data.price }));
          });
      }
    });
  }

  //
  public _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (this.filteringtype == 'suppliers') {
      // this.selecteditem = this.supp.filter(option => option.fullname.toLowerCase().includes(filterValue));
      return this.supp.filter(option => option.fullname.toLowerCase().includes(filterValue));
    }
    else if (this.filteringtype == 'customers') {
      console.log(this.cuss.filter(option => option.fullname.toLowerCase().includes(filterValue)));
      return this.cuss.filter(option => option.fullname.toLowerCase().includes(filterValue));
    }
    else if (this.filteringtype == 'items') {
      //console.log(this.cuss.filter(option => option.titlear.toLowerCase().includes(filterValue)));
      return this.productsview.filter(option => option.titlear.toLowerCase().includes(filterValue));
    }

  }

  additem(item) {
    console.log(item);
    this.invoiceitems.push(item);
    this.invoice.totalprice = this.invoice.totalprice + Number(item.totalprice);
    this.product = {};
    this.processinfo.reminder += Number(item.totalprice);


  }

  remove(item, i) {
    this.invoice.totalprice = this.invoice.totalprice - Number(item.totalprice);
    this.invoiceitems.splice(i, 1);
    this.product = {};
  }

  setitem(item) {
    console.log('hello');


    return item.titlear;

  }

  setfiltertype() {
    console.log('hello');

    this.filteringtype = 'items';
  }

  setType(type) {
    this.reset();
    this.invoice.type = type;
    if (type == 's') {
      this.filteringtype = 'customers';
      this.operation = 'المبيعات';
      this.invoice.shipno='no';
    } else {
      this.filteringtype = 'suppliers';
      this.operation = 'المشتريات';

    }
    this.getsupcusinfo();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
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

  private reset() {
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
    this.invoice = {
      type: "",
      data: {},
      id: 0,
      shipno: "",
      totalprice: 0,
      entityid: 0,
      user: 0


    }
    this.invoiceitems = [];
    this.payments = [];
    this.processinfo = {
      reminder: 0,
      status: ""
    };
    this.supp = [];
    this.cuss = [];
    this.selecteditem = {
      id: 0,
      type: "",
      fullname: "",
      data: {},
      balance: 0
    };
    this.invoiceitems = [];
  }

  save() {

    this.invoice.entityid = this.selecteditem.id;
    this.invoice.user = this.user.id;
    this.invoicedata = {
      payments: this.payments,
      items: this.invoiceitems
    };
    this.invoice.data = JSON.stringify(this.invoicedata);
    console.log(this.invoice);

    this._hs.post('pursales', this.invoice).subscribe(res => {
      //confirm(res.text());
      this.insertchecks(Number(res.text()));
      if(this.processinfo.reminder!=0){
        this.updatecustomeraccount();
        this.updateuserbalance();
      }
      this._ss.setSnackBar("تمت العملية بنجاح الرجاء طباعة الفاتورة");
    });
   



  }

  updateuserbalance(){
    this.payments.forEach(element => {
      if (element.paymentmethod == "cash") {
        this.user.balance =Number(this.user.balance) + Number(element.amount);
      }}
    );
    console.log(this.user);
    
    this._hs.put('users',"id", this.user).subscribe(res2 => {
      this._ss.setSnackBar("تم  تعديل رصيد المستخدم  ");
    });
  }

  private updatecustomeraccount(){
    if(this.invoice.type=='s'){
      this.selecteditem.balance = this.selecteditem.balance-this.processinfo.reminder;
    }else{
      this.selecteditem.balance = this.selecteditem.balance+this.processinfo.reminder;
    }
    this.selecteditem.data=JSON.stringify(this.selecteditem.data);
    this._hs.put('suppcus',"id", this.selecteditem).subscribe(res2 => {
      this._ss.setSnackBar("تم  تعديل رصيد العميل أو المورد");
    });
  }

  private insertchecks(invoiceid) {
    confirm(invoiceid);
    this.payments.forEach(element => {
      if (element.paymentmethod == "check") {
        if (element.bankname != "" && element.checkNo != "" && element.amount != 0) {
          this.check.user = this.user.id;
          this.check.invoice = invoiceid;
          this.check.bankname = element.bankname;
          this.check.checkowner = element.checkowner;
          this.check.amount = element.amount;
          this.check.checkno = element.checkno;
          if (this.invoice.type == 's') {
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

  sum(x, y) {
    console.log("hello :", x, "y :", y);

    this.product.totalprice = Number(x) * Number(y) + "";
  }


  public paymentmethods: Choice[] = [
    { value: 'check', viewValue: 'شيك' },
    { value: 'cash', viewValue: 'كاش' }
  ]

  public checkstatus: Choice[] = [
    { value: 'clarified', viewValue: 'مظهر' },
    { value: 'new', viewValue: 'جديد' }
  ]

  public paymenttypes: Choice[] = [
    { value: 'prepayment', viewValue: 'مقدم' },
    { value: 'postpayment', viewValue: 'مؤخر' },
    { value: 'internal', viewValue: 'ترحيل خارجي' },
    { value: 'transport', viewValue: 'ترحيل داخلي' },
    { value: 'customs', viewValue: 'جمارك' }
  ]


  addpayment() {

    this.payment = {};
    console.log('hello');

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
      if (this.paid != 0) {
        this.processinfo.reminder = this.invoice.totalprice - this.paid;
      }

      console.log(this.payments);
      this.paid = 0;
    }
    else{
      this._ss.setSnackBar("الرجاء ملء بيانات الدفع");
    }

  }

  selected(item) {
    this.invoice.entityid = item.id;
    console.log(this.invoice.entityid);

  }

  displayFn(val: any) {
    return val ? val.fullname : val;
  }
}

interface Choice {
  value: string;
  viewValue: string;
}


