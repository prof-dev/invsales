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
import { InventoryClass, UtilityClass } from 'src/app/services/classes';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  public utility:UtilityClass;
  public sadad: any={};
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
    amount: 0,
    suppcusid: 0,
    userid: 0
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
    namear: "",
    data: {},
    amount: 0
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
    userid: 0,
    comment: "",
    pursalesid: 0
  };
  public classes: any[] = [];
  public list: any[] = [];



  public operation: string = "";
  store: any={};
  stores: any[] = [];
  public storeselect: any[] = [];
  invoicedata: { //payments: any[]
    items: any[];
  };
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
  storeid: any;


  constructor(private _hs: HttpService,
    private _ss: ShareService, private _ut: UtilsService, private _ar: ActivatedRoute,
    private _router: Router) {
    this.inventoryObj = new InventoryClass(this._hs, this._ss);
    this._ar.params.subscribe(params => this.param = params['id']);
    this.utility=new UtilityClass();

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
    // console.log(storeobj);

    this.temp = this.storeselect.find(obj => obj.id == storeobj);

    return this.temp.namear;
  }

  private getInventories() {
    this._hs.get('inventory')
      .subscribe(res => {
        this.inventories = res.json().inventory;
        console.log(this.inventories);
        this.inventories.forEach(element => {
          this.items = JSON.parse(element.data);
          element.data = this.items;
        });
      });
  }

  private getallstores() {
    this._hs.get('lookups', 'filter=group,eq,stores')
      .subscribe(res => {
        this.store = res.json().lookups[0];
        this._hs.get('lookups', 'filter[]=parent,eq,' + this.store.id)
          .subscribe(res => {
            this.stores = res.json().lookups;
            this.storeselect = this.stores.map(stores => ({ id: stores.id, namear: stores.namear }));
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
        this.lookups.forEach(element => {
          element.data = JSON.parse(element.data);
        });
        this.productsview = this.lookups.map(lookup => ({ id: lookup.id, namear: lookup.namear, price: lookup.data.price, parent: lookup.parent }));
        this.list = this.productsview;
      });
  }
  getitemsbyclass() {
    if (this.processinfo.parent != 0) {


      this.list = this.productsview.filter(option => option.parent == this.processinfo.parent);

    }


  }
  //
  public _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    if (this.filteringtype == 'suppliers') {
      // this.selecteditem = this.supp.filter(option => option.namear.toLowerCase().includes(filterValue));
      return this.supp.filter(option => option.namear.toLowerCase().includes(filterValue));
    }
    else if (this.filteringtype == 'customers') {
      return this.cuss.filter(option => option.namear.toLowerCase().includes(filterValue));
    }
    else if (this.filteringtype == 'items') {
      //console.log(this.cuss.filter(option => option.namear.toLowerCase().includes(filterValue)));
      return this.productsview.filter(option => option.namear.toLowerCase().includes(filterValue));
    }

  }


  additem(item) {
    console.log("item json  : "+item.store.id);
    this.storeid=item.store.id;
    // console.log(this.inventories);
    console.log(this.invoice.type);

    if (this.invoice.type == 's') {
      this.inventory = this.inventories.find(obj => obj.storeid == item.store.id);

      if (this.inventory != null) {

        this.inventory.data.forEach(element => {
          console.log(element);

          if ((!((Number(element.avb) - Number(element.rsv) + Number(element.com)) < Number(item.count))) && element.id == item.id) {
            console.log("sales after check available stock:",item);
            this.invoiceitems.push(item);
            this.invoice.amount = this.invoice.amount + Number(item.totalprice);
            this.product.store =  this.storeid;
            this.product = {};
            this.processinfo.reminder += Number(item.totalprice);
            element.rsv = Number(element.rsv) + Number(item.count);
            this.istouched = false;
            this.touched.forEach(el => {
              if (el == item.store.id) {
                this.istouched = true;
              }
            });
            if (!this.istouched) {
              this.touched.push(this.storeid);
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
      this.invitem.id=item.id;
      this.invitem.com =  Number(item.count);
      this.invoice.amount = this.invoice.amount + Number(item.totalprice);
      this.product.store = this.storeid;
      this.product = {};
      this.touched.push(this.storeid);
      console.log("purchase add to inventories:",this.inventories);
      
      this.inventories = this.inventoryObj.additemtolist(this.invitem, this.storeid, this.inventories,true);
      console.log("purchase after add to inventories:",this.inventories);

      this.invoiceitems.push(item);

    }
  }

  remove(item, i) {
    this.invoice.amount = this.invoice.amount - Number(item.amount);
    this.invoiceitems.splice(i, 1);
    this.inventories.forEach(element => {
      if (element.storeid == item.store.id) {
        element.data.forEach(el => {
          if (this.invoice.type == 's') {
            el.rsv = Number(el.rsv) + Number(item.count);
          }
          else {
            el.com = Number(el.com) - Number(item.count);

          }
        });
      }
    });
    this.product = {};
  }

  setitem(item) {
    console.log('hello');


    return item.namear;

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
        // this.payments = this.invoicedata.payments;
        console.log(this.suppcus);

        this.selecteditem = this.suppcus.find(obj => obj.id == this.invoice.suppcusid);

        this.selecteditem.data = JSON.parse(this.selecteditem.data + "");
        this.getPaymentInfoByInvoice(id);

        console.log('selected customer:', this.selecteditem);


      });
    this._ss.setAppIsBusy(false);





  }

  getPaymentInfoByInvoice(pursalesid) {
    this._hs.get('sadad', 'filter=pursalesid,eq,' + pursalesid)
      .subscribe(res => {
        this.sadad = res.json().sadad[0];
        this.sadad.data = JSON.parse(this.sadad.data);
        this.payments = this.sadad.data;
      }
      );
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
            console.log("customeris :", element.namear);
            this.cuss.push(element);
          }
          else if (element.type == 's') {
            this.supp.push(element);
            console.log("supplier is :", element.namear);
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
      userid: 0,
      comment: "",
      pursalesid: 0
    };
    this.invoice = {
      type: "",
      data: {},
      id: 0,
      shipno: "",
      amount: 0,
      suppcusid: 0,
      userid: 0


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
      namear: "",
      data: {},
      amount: 0
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
    this.touched = [];
  }

  saveToSadad(invoiceid) {
    if (this.selecteditem.id != null && this.payments.length > 0) {
      this.sadad.pursalesid = invoiceid;
      this.sadad.suppcusid = this.selecteditem.id;
      this.sadad.data = JSON.stringify(this.payments);
      this.sadad.amount=this.paid;
      if (this.invoice.type == 's') {

        this.selecteditem.amount = Number(this.selecteditem.amount) - Number(this.processinfo.reminder);
        this.sadad.newbalance = Number(this.selecteditem.amount) - Number(this.processinfo.reminder);
        this.sadad.source='in';
      }
      else {
        this.selecteditem.amount = Number(this.selecteditem.amount) + Number(this.processinfo.reminder);
        this.sadad.newbalance = Number(this.selecteditem.amount) + Number(this.processinfo.reminder);
        this.sadad.source='out';

      }
      this.sadad.oldbalance = this.selecteditem.amount;

      this.sadad.userid = this.user.id;
      this.sadad.total = this.paid;
      this._hs.post('sadad', this.sadad).subscribe(res => {
        this.sadad.id = res.text();
        // this.updatesuppcussbalance();
        // this.insertchecks();
        this._ss.setSnackBar('تم حفظ الدفعية بنجاح');
      });

    }
    else {
      this._ss.setSnackBar('الرجاء تعبئة الحقول الأساسية');

    }
  }
  save() {
    console.log("touched items :"+this.touched);
    
    if (this.processinfo.status != "print" && this.selecteditem != null) {
      this.invoice.suppcusid = this.selecteditem.id;
      this.invoice.userid = this.user.id;
      this.invoicedata = {

        items: this.invoiceitems
      };
      this.invoice.data = JSON.stringify(this.invoicedata);
      console.log(this.invoice);

      this._hs.post('pursales', this.invoice).subscribe(res => {
        this.invoice.id = Number(res.text());
        this.updateuserbalance();
        this.updateInventory();
        this.insertchecks(this.invoice.id);
        this.saveToSadad(res.text());
        if (this.processinfo.reminder != 0) {
          this.updatecustomeraccount();

        }
      
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
    if (this.invoice.type == 's') {
      this._ut.showReport('إذن  إستلام بضاعة');

    } else {
      this._ut.showReport(' إضافة مشتريات للمخزن ');

    }
  }

  updateuserbalance() {
    this.payments.forEach(element => {
      if (element.paymentmethod == "cash") {
        this.user.amount = Number(this.user.amount) + Number(element.amount);
      }
    }
    );
    console.log(this.user);

    this._hs.put('users', "id", this.user).subscribe(res2 => {
      this._ss.setSnackBar("تم  تعديل رصيد المستخدم  ");
    });
  }

  private updatecustomeraccount() {
    // if (this.invoice.type == 's') {
    //   this.selecteditem.amount = Number(this.selecteditem.amount) - Number(this.processinfo.reminder);
    // } else {
    //   this.selecteditem.amount = Number(this.selecteditem.amount) + Number(this.processinfo.reminder);
    // }
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
          this.check.userid = this.user.id;
          this.check.pursalesid = invoiceid;
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
        this.payment = {};

      });
      if (this.paid != 0) {
        this.processinfo.reminder = this.invoice.amount - this.paid;
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
    this.invoice.suppcusid = item.id;
    console.log(this.invoice.suppcusid);

  }

  displayFn(val: any) {
    return val ? val.namear : val;
  }

  numbertToWords(num) {
    return this.utility.numbertToWords(num);
    
  }
}

interface Choice {
  value: string;
  viewValue: string;
}


