import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.css']
})
export class LookupsComponent implements OnInit {
  public user: any;
  public nodes: any[] = [];
  public lookups: any[] = [];
  public lookupitems: any[] = [];
  public group: any = null;
  public visible: boolean;
  public operation: string = "new";
  public form: boolean = false;
  public i:number;

  public bank :any;

  public data :any;

  filterby: any;


  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }



  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      } else {
        this._hs.get('lookups', 'filter=isleaf,eq,0')
          .subscribe(res => {
            this.lookups = res.json().lookups;
            console.log(this.lookups);


          })
      }
    });


  }
  setGroup(group) {
   // this.visible = true;
    this.data = {
      address: "", balance: 0, price: 0
    };
    this.bank = {
      group: group.group,
      id: null,
      parent: 0,
      isleaf: 0,
      titleen: "",
      titlear: "",
      data:null
    };
    
    this.form = false;
    this.group = group;
    if (group.group == "new") {
      this.filterby = 0;
    }
    else {
      this.filterby = group.id;
    }
    this._hs.get('lookups', 'filter[]=parent,eq,' + this.filterby)
      .subscribe(res => {
        this.lookupitems = res.json().lookups;
       
      })
    
    this.visible = true;
    console.log("group is set to:", group.group);


  }

  modify(item) {
    this.visible=false; 
    this.operation = "تعديل";
    this.form = true;
    this.data = JSON.parse(item.data);
    console.log(JSON.parse(item.data));
    
    this.bank.titlear = item.titlear;
    this.bank.id = item.id;
    this.bank.group = item.group;
    this.bank.isleaf = item.isleaf;
    this.bank.parent = item.parent;
    this.bank.data=this.data;
  
    
    this.bank.titleen = item.group;
    this.visible = false;

  }
  delete(item) {
    this._hs.delete('lookups', item.id).subscribe(res => {
      console.log("deletion result:" + res);
      if (res.status == 200) {
        this.ngOnInit();
        this.setGroup(this.group);
      }

    });
  }

  addnew() {
    this.bank.id=null;
    this.form = true;
    this.operation = "إدخال جديد";
    this.bank.titlear = "";
    this.data.address = "";
    this.data.balance = 0;
    this.data.price=0;
    this.bank.titleen = this.bank.group;
    this.visible = false;
  
    
    this.bank.parent = this.group.id;
  }

  save(item,d) {

    if (item.id == null) {
      if (this.group.group == 'new') {
        item.parent = 0;

      }
      item.parent = this.group.id;
      this.bank.data= JSON.stringify(d);
      
      console.log(item.data);

      this._hs.post('lookups', item).subscribe(res => {

        console.log("تمت إضافة " + this.group.titlear + " id :" + res);

      })



    }
    else {

      if (this.group.group != 'new') {
        item.parent = this.group.id;
      } else {
        item.parent = this.group.id;
      }



      item.data = JSON.stringify(d);
      console.log(item.selected);

      this._hs.put('lookups', "id", item).subscribe(res => {

        console.log("تمت تعديل " + this.group.titlear + " id :" + res);

      })
    }

    // this._router.navigateByUrl('/lookups'); 
    this.ngOnInit();
    this.form = false;


  }




  public leaf: Choice[] = [
    { value: '1', viewValue: 'فرع نهائي' },
    { value: '0', viewValue: 'قسم رئيسي / أو فرعي' }]

}

interface Choice {
  value: string;
  viewValue: string;
}
