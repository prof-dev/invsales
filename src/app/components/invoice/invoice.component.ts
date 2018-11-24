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
  customers: string[] = [];
  suppliers: string[] = [];
  public optionids: any[] = [];
  public filteredOptions: Observable<string[]>;
  public user: any;
  public invoice: any;
  public data: any;
  public items: any[] = [];
  public showiteminsert: boolean;
  public item: any;
  public payment: any;
  public payments: any[] = [];
  public suppcus: any[] = [];
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

  public stocks = {
    item: 0,
    avail: 0,
    rsv: 0,
    coming: 0,
  }

  public operation: string = "";


  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }


  ngOnInit() {

    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      } else {
        this._hs.get('lookups', 'filter=group,eq,item')
          .subscribe(res => {
            this.items = res.json().lookups;
            console.log(this.items);



          });
      }
    });


    this.invoice = {
      type: "",
      date: Date,
      data: "",
      id: 0,
      shipmentnumber: 0,
      totalprice: 0,
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

  //
  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.invoice.type == 'p') {
      return this.suppliers.filter(option => option.toLowerCase().includes(filterValue));
    }
    else if (this.invoice.type == 's') {
      return this.customers.filter(option => option.toLowerCase().includes(filterValue));
    }

  }

  additem(item) {
    this.showiteminsert = true;


  }

  setType(type) {


    this.customers = [];
    this.suppliers = [];
    this.invoice.type = type;
    if (type == 's') {
      this.operation = 'المبيعات';
    } else {
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

            this.customers.push(element.fullname + "," + element.id + "," + element.data.phone);
          }
          else if (element.type == 's') {

            console.log("supplier is :", element.fullname);
            this.suppliers.push(element.fullname + "," + element.id + "," + element.data.phone);
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


}

interface Choice {
  value: string;
  viewValue: string;
}

