import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  public user: any;
  public display = "";
  public entrytype = "";
  public touched:number[]=[];
  public actionstore=0;
  public storeselect: any[] = [];
  public lookups: any[] = [];
  public productsview: any[] = [];
  public items: Item[] = [];
  public item: any = {};
  public inventroy = {
    storeid: 0,
    data: null
  }
  public stores: any[] = [];
  public inventories: any[] = [];
  public store: any = {};
  result: string;
  istouched: boolean;
   isexist: boolean;
  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }

  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      }
      this.item = {
        id: 0,
        avb: 0,
        rsv: 0,
        com: 0
      };
      ////   retrieve from inventroy to list items in each stock
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

      this.getallitems();



      ///////  retrieve all the stores by the group name of the parent
      this._hs.get('lookups', 'filter=group,eq,stores')
        .subscribe(res => {
          this.store = res.json().lookups[0];
          console.log(this.store);
          this._hs.get('lookups', 'filter[]=parent,eq,' + this.store.id)
            .subscribe(res => {
              this.stores = res.json().lookups;
              console.log(this.stores);
              this.storeselect = this.stores.map(stores => ({ id: stores.id, titlear: stores.titlear }));
              console.log(this.storeselect);



            });
        });


    });
  }

  private getallitems() {
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

  additemtolist(item) {
    console.log(this.items.length);
    this.isexist=false;
    this.items.forEach(element => {
     
      if (element.id == item.id) {
        this.isexist=true;
        element.avb =element.avb+parseInt(item.avb);
        element.rsv =  element.rsv+parseInt(item.rsv);
        element.com =  element.com+parseInt(item.com);
      }
      
    });
    if(!this.isexist){
      item.avb=parseInt(item.avb);
      item.id=parseInt(item.id);
      item.rsv=parseInt(item.rsv);
      item.com=parseInt(item.com);
      this.items.push(item);
    }
    this.inventories.forEach(element => {
      if(element.storeid==this.actionstore){
        element.data=this.items;
      }
    });
    this.istouched=false;
    this.touched.forEach(element => {
      if(element==this.actionstore){
        this.istouched=true;
      }
    });
    if(!this.istouched){
      this.touched.push(this.actionstore);
    }

    this.item = {
      id: 0,
      avb: 0,
      rsv: 0,
      com: 0
    };

    console.log(this.items);

  }

  openinsertitem(list: any[], storeid,type) {
    this.items = [];
    this.items = list;
    this.entrytype = type;
    if(storeid!=""){
      this.display = this.getstorename(storeid);
      this.actionstore=storeid;
    }
    
    
    console.log(this.display);
    
  }

  getstorename(id): string {

    this.result = "";
    this.storeselect.forEach(element => {
      if (element.id == id) {
        console.log("je");

        this.result = element.titlear;

      }

    });
    return this.result;
  }

  getproductname(id): string {

    this.result = "";
    this.productsview.forEach(element => {
      if (element.id == id) {
        console.log(element.titlear);

        this.result = element.titlear;

      }

    });
    return this.result;
  }

  save(){
    this.touched.forEach(outer => {
      this.inventories.forEach(inner => {
        if(outer==inner.storeid){
          inner.data=JSON.stringify(inner.data);
          this._hs.put('inventory','storeid',inner).subscribe(res =>{
     
            this._ss.setSnackBar('inserted page is refreshed for you');
          });
        }
      });
    });
    
    this.touched=[];
    this.ngOnInit();
    
  }

}
export interface Item {
  id: number,
  avb: number,
  rsv: number,
  com: number
}
// export interface Data{
//   price:number,
//   address:string,
//   balance:number
// }
