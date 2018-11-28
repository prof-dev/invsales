import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { fadeInItems } from '@angular/material';

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
  public filteringtype="";
  public optionids: any[] = [];
  public filteredOptions: Observable<any[]>;
  public user: any;
  public invoice: any;
  public invoiceitems:any[]=[];
  public data: any;
  public items: any[] = [];
  public showiteminsert: boolean;
  public item: any;
  public payment: any;
  public payments: any[] = [];
  public suppcus: any[] = [];
  public selecteditem={
    id: 0,
    type: "",
    fullname: "",
    data: {},
    balance: 0
  };
  public product:any={};
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

  public inventory = {
    id: 0,
    data: [],
  }

  

  public operation: string = "";
  store: any;
  stores: any[]=[];
  public storeselect: any[]=[];


  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }


  ngOnInit() {

    this.refresh();
    this.getallstores();

    this.invoice = {
      type: "",
      date: Date,
      data: "",
      id: 0,
      shipno: 0,
      total: 0,
      intityid: 0


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
      paymentmethod: "شيك",
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
    else if (this.filteringtype== 'customers') {
      console.log(this.cuss.filter(option => option.fullname.toLowerCase().includes(filterValue)));
      return this.cuss.filter(option => option.fullname.toLowerCase().includes(filterValue));
    }
    else if (this.filteringtype== 'items') {
      //console.log(this.cuss.filter(option => option.titlear.toLowerCase().includes(filterValue)));
      return this.productsview.filter(option => option.titlear.toLowerCase().includes(filterValue));
    }

  }

  additem(item) {
   console.log(item);
   
    this.invoiceitems.push(item);
    this.invoice.total +=parseInt(item.totalprice);
    this.product={};


  }

  remove(item,i){
    this.invoice.total =parseInt(this.invoice.total)-parseInt(item.totalprice);

      // console.log("Delete ",id);
      this.invoiceitems.splice(i, 1);
      
  //  this.invoiceitems=this.invoiceitems.map(x=>x.id !== item.id);
    this.product={};
  }

  setitem(item){
    console.log('hello');
    
   
    return item.titlear;

  }

  setfiltertype(){
    console.log('hello');
    
    this.filteringtype='items';
  }

  setType(type) {

    this.supp = [];
    this.cuss = [];
    this.selecteditem;
    this.invoiceitems=[];
    this.invoice.type = type;
    if (type == 's') {
      this.filteringtype='customers';
      this.operation = 'المبيعات';
    } else {
      this.filteringtype='suppliers';
      this.operation = 'المشتريات';

    }
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
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

  }

  save() {


  }


  sum(x,y){
    console.log("hello :",x,"y :",y);
    
    this.product.totalprice= parseInt(x)*parseInt(y)+"";
  }


  public paymentmethods: Choice[] = [
    { value: 'check', viewValue: 'شيك' },
    { value: 'chash', viewValue: 'كاش' },
    { value: 'other', viewValue: 'أخرى' }
  ]

  public paymenttypes: Choice[] = [
    { value: 'prepayment', viewValue: 'مقدم' },
    { value: 'postpayment', viewValue: 'مؤخر' },
    { value: 'internal', viewValue: 'ترحيل خارجي' },
    { value: 'transport', viewValue: 'ترحيل داخلي' },
    { value: 'customs', viewValue: 'جمارك' }
  ]


  selected(item) {
   console.log('hello');
  
    //this.selecteditem = item;

   
    // return item.fullname;
  }

  displayFn(val: any) {
    return val ? val.fullname : val;
  }
}

interface Choice {
  value: string;
  viewValue: string;
}


