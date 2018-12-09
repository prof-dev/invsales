import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { fadeInItems, DateAdapter } from '@angular/material';
import { UtilsService } from 'src/app/services/utils.service';
import { Item } from '../inventory/inventory.component';
import { InventoryClass } from 'src/app/services/classes';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  public inventoryObj: InventoryClass;
  public touched: number[] = [];
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
  @ViewChild('date')
  public date: any;
  public invoiceitems: any[] = [];
  public data: any;
  public items: any[] = [];
  public payments: any[] = [];
  public showiteminsert: boolean;
  public item: any;
  public payment: any;
  public suppcus: any[] = [];
  public processinfo = {
    parent: 0,
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
  public classes: any[] = [];
  public list: any[] = [];



  public operation: string = "";
  store: any;
  stores: any[] = [];
  public storeselect: any[] = [];
  invoicedata: { payments: any[]; items: any[]; };
  public invoiceid = 0;
  public paid = 0;
  suppcussdata: string;
  public inventories: any[] = [];

  public inventory = {
    storeid: 0,
    data: null
  }
  public invitems: Item[] = [];
  public invitem = {
    id: 0,
    avb: 0,
    rsv: 0,
    com: 0
  };
  goodsobj: any;
  public param = 0;
  temp: any;
  istouched: boolean;


  constructor(private _hs: HttpService,
    private _ss: ShareService, private _ut: UtilsService, private _ar: ActivatedRoute,
    private _router: Router) {
      this.inventoryObj = new InventoryClass(this._hs,this._ss);
    this._ar.params.subscribe(params => this.param = params['id']);

  }


  ngOnInit() {
    console.log("this.param :", this.param);

    this.refresh();
    this.getallstores();
    this.getInventories();
    this.getallclasses();
    this.getsupcusinfo();

    if (this.param != null) {
      this.getInvoiceById(this.param);
    }
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
      rate: 0.00,
      date: ""
    }


  }
  private getallclasses() {
    this._hs.get('lookups', 'filter=group,eq,goods')
      .subscribe(res => {
        this.goodsobj = res.json().lookups[0];
        // console.log(this.goodsobj);
        this._hs.get('lookups', 'filter[]=parent,eq,' + this.goodsobj.id)
          .subscribe(res => {
            this.classes = res.json().lookups;
            console.log(this.classes);

          });
      });
  }

  getStoreName(storeobj): string {
    console.log("====================");
    console.log(storeobj);

    this.temp = this.storeselect.find(obj => obj.id == storeobj);

    return this.temp.titlear;
  }

  private getInventories() {
    this._hs.get('inventory')
      .subscribe(res => {
        this.inventories = res.json().inventory;
        console.log(this.inventories);
        this.inventories.forEach(element => {
          this.items = JSON.parse(element.data);
          element.data = this.items;
          console.log(this.items);
        });
      });
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
        this.getAllItems();
      }
    });
  }

  private getAllItems() {
    this._hs.get('items')
      .subscribe(res => {
        this.lookups = res.json().items;
        console.log(this.lookups);
        this.lookups.forEach(element => {
          element.data = JSON.parse(element.data);
          console.log(this.items);
        });
        this.productsview = this.lookups.map(lookup => ({ id: lookup.id, titlear: lookup.arname, price: lookup.data.price, parent: lookup.parent }));
        this.list = this.productsview;
      });
  }
  getitemsbyclass() {
    if (this.processinfo.parent != 0) {
      console.log(this.processinfo.parent);
      // console.log(this.productsview);


      this.list = this.productsview.filter(option => option.parent == this.processinfo.parent);

    }


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
    // console.log(this.inventories);
    console.log(this.invoice.type);
    
    if (this.invoice.type == 's') {
      this.inventory = this.inventories.find(obj => obj.storeid == item.store.id);

      if (this.inventory != null) {

        this.inventory.data.forEach(element => {
          console.log(this.inventory.data);

          if ((!((Number(element.avb) - Number(element.rsv) + Number(element.com)) < Number(item.count))) && element.id == item.id) {
            console.log(item);
            this.invoiceitems.push(item);
            this.invoice.totalprice = this.invoice.totalprice + Number(item.totalprice);
            this.product.store = item.store.id;
            this.product = {};
            this.processinfo.reminder += Number(item.totalprice);
            element.rsv = Number(element.rsv) + Number(item.count);
            this.istouched = false;
            this.touched.forEach(el => {
              if (el == item.store.id) {
                this.istouched = true;
              }
            });
            if (this.istouched) {
              this.touched.push(item.store.id);
            }


          }
          else {
            this._ss.setSnackBar('عذرا الكمية بالمخزن غير كافية');
          }
        });

      }
      else {
        this._ss.setSnackBar('عذرا لا تتوفر أصناف بالمخزن المختار');
      }


    }
    else if (this.invoice.type == 'p') {
      this.invitem.com=Number(this.invitem.com)+Number(item.count);
      this.touched.push(item.store.id);
      this.inventories=this.inventoryObj.additemtolist(this.invitem,item.store.id,this.inventories);
      this.invoiceitems.push(item);

    }
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
      this.invoice.shipno = 'no';
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

  getInvoiceById(id) {
    this._ss.setAppIsBusy(true);
    this._hs.get('pursales', 'filter=id,eq,' + id)
      .subscribe(res => {
        this.invoice = res.json().pursales[0];
        console.log("retrieved inv", this.invoice);

        this.invoicedata = JSON.parse(res.json().pursales[0].data);
        this.invoiceitems = this.invoicedata.items;
        this.payments = this.invoicedata.payments;
        console.log(this.suppcus);

        this.selecteditem = this.suppcus.find(obj => obj.id == this.invoice.entityid);

        this.selecteditem.data = JSON.parse(this.selecteditem.data + "");


        console.log('selected customer:', this.selecteditem);


      });
    this._ss.setAppIsBusy(false);


  }

  private getsupcusinfo() {
    this._hs.get('suppcus')
      .subscribe(res => {
        // this.suppcus = res.json().suppcus;
        console.log(res.json());
        this.suppcus = res.json().suppcus;
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
      parent: 0,
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
  updateInventory() {
    this.touched.forEach(outer => {
      this.inventories.forEach(inner => {
        if (outer == inner.storeid) {
          inner.data = JSON.stringify(inner.data);
          this._hs.put('inventory', 'storeid', inner).subscribe(res => {

            this._ss.setSnackBar('inserted page is refreshed for you');
            this.getInventories();
          });
        }
      });
    });
    this.touched=[];
  }
  save() {
    if (this.processinfo.status != "print") {
      this.invoice.entityid = this.selecteditem.id;
      this.invoice.user = this.user.id;
      this.invoicedata = {
        payments: this.payments,
        items: this.invoiceitems
      };
      this.invoice.data = JSON.stringify(this.invoicedata);
      console.log(this.invoice);

      this._hs.post('pursales', this.invoice).subscribe(res => {
        this.invoice.id = Number(res.text());
        //confirm(res.text());
        this.insertchecks(this.invoice.id);
        if (this.processinfo.reminder != 0) {
          this.updatecustomeraccount();

        }
        this.updateuserbalance();
        this.updateInventory();
        this.processinfo.status = "print";
        this._ss.setSnackBar("تمت العملية بنجاح الرجاء طباعة الفاتورة");

      });

    }
    else {
      this._ss.setSnackBar("تم إصدار هذه الفاتورة من قبل رقم الفاتورة هو :" + this.invoice.id);
    }




  }

  print() {
    this._hs.log('user1', 'tbl1', 'c', 'screen x', 'so and so');
    this._ut.showReport('إذن  إستلام بضاعة');
  }

  updateuserbalance() {
    this.payments.forEach(element => {
      if (element.paymentmethod == "cash") {
        this.user.balance = Number(this.user.balance) + Number(element.amount);
      }
    }
    );
    console.log(this.user);

    this._hs.put('users', "id", this.user).subscribe(res2 => {
      this._ss.setSnackBar("تم  تعديل رصيد المستخدم  ");
    });
  }

  private updatecustomeraccount() {
    if (this.invoice.type == 's') {
      this.selecteditem.balance = this.selecteditem.balance - this.processinfo.reminder;
    } else {
      this.selecteditem.balance = this.selecteditem.balance + this.processinfo.reminder;
    }
    this.suppcussdata = JSON.stringify(this.selecteditem.data);
    this.selecteditem.data = this.suppcussdata;
    this._hs.put('suppcus', "id", this.selecteditem).subscribe(res2 => {
      this._ss.setSnackBar("تم  تعديل رصيد العميل أو المورد");
    });
    this.selecteditem.data = JSON.parse(this.suppcussdata);
  }

  private insertchecks(invoiceid) {
    console.log("invoice id :", invoiceid);

    this.payments.forEach(element => {
      if (element.paymentmethod == "check") {
        if (element.bankname != "" && element.checkNo != "" && element.amount != 0 && element.date != "") {
          this.check.user = this.user.id;
          this.check.invoice = invoiceid;
          this.check.bankname = element.bankname;
          this.check.checkowner = element.checkowner;
          this.check.amount = element.amount;
          this.check.checkno = element.checkno;
          this.check.date = (new Date(element.date)).toISOString().split('T')[0];


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
      else {
        this._ss.setSnackBar("الرجاء مراجعة بيانات الشيك");
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
  editPayment(row) {
    this.payment = row;

  }
  deletePayment(index, row) {
    this.processinfo.reminder = Number(this.processinfo.reminder) + Number(row.amount);
    this.payments.splice(index, 1);
    this.payment = {};

  }

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
    else {
      this._ss.setSnackBar("الرجاء ملء بيانات الدفع");
    }
    this.payment.paymentmethod = payment.paymentmethod;

  }

  selected(item) {
    this.invoice.entityid = item.id;
    console.log(this.invoice.entityid);

  }

  displayFn(val: any) {
    return val ? val.fullname : val;
  }

  numbertToWords(num) {
    var number = parseInt(num);
    if (number == 0) return ' ';

    var words = "";
    if (Math.floor(number / 1000000) > 0) {
      words += this.numbertToWords(Math.floor(number / 1000000)) + ' مليون ';
      number %= 1000000;
    }
    if (Math.floor(number / 1000) > 0) {
      words += this.numbertToWords(Math.floor(number / 1000)) + ' ألف ';
      number %= 1000;
    }
    if (Math.floor(number / 100) > 0) {
      words += this.numbertToWords(Math.floor((number / 100))) + ' مائة ';
      number %= 100;
    }
    if (number > 0) {
      if (words != "") { words += "  " }

      var unitmap = ['', 'واحد', 'اثنان', 'ثلاثة', 'اربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'احدى عشر', 'اثنا عشر', 'ثلاثة عشر', 'اربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
      var tensmap = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
      if (number < 20) words += unitmap[number];
      else {
        console.log('number/10', Math.floor(number / 10));
        console.log(number % 10);

        if ((number / 10) > 0) words += unitmap[number % 10];
        words += " و " + tensmap[Math.floor(number / 10)];

      }
    }
    return words;
  }
}

interface Choice {
  value: string;
  viewValue: string;
}


