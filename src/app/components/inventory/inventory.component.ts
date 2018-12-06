import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  public user: any;
  public display = "";
  public entrytype = "";
  public touched: number[] = [];
  public deleted: any[] = [];
  public new: number[] = [];
  public actionstore = 0;
  public storeselect: any[] = [];
  public lookups: any[] = [];
  public productsview: any[] = [];
  public items: Item[] = [];
  public item = {
    id: 0,
    avb: 0,
    rsv: 0,
    com: 0
  };
  public actionindex = 0;
  // public inv:{
  //   storeid:0,
  //   data:[]
  // }
  public inventroy = {
    storeid: 0,
    data: null
  }
  public stores: any[] = [];
  public classes: any[] = [];
  public inventories: any[] = [];
  public store: any = {};
  public goodsobj: any = {};
  public selectedclass: any = {};
  result: string;
  istouched: boolean;
  isexist: boolean;
  storeexist: boolean;
  public processinfo = {
    parent: 0,
    store: 0

  }
  public list: any[] = [];

  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }

  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      }

      ////   retrieve from inventroy to list items in each stock
      this.getInventories();

      this.getAllItems();
      this.getallclasses();



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

  private getAllItems() {
    this._hs.get('items')
      .subscribe(res => {
        this.lookups = res.json().items;
        console.log(this.lookups);
        this.lookups.forEach(element => {
          element.data = JSON.parse(element.data);
          // console.log(this.items);
        });
        this.productsview = this.lookups.map(lookup => ({ id: lookup.id, titlear: lookup.arname, price: lookup.data.price, parent: lookup.parent }));
        this.list = this.productsview;
      });
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

 getitemsbyclass() {
    if (this.processinfo.parent != 0) {
      console.log(this.processinfo.parent);
      console.log(this.productsview);


      this.list = this.productsview.filter(option => option.parent == this.processinfo.parent);

    }


  }


  additemtolist(item) {
    console.log(item.id);
    this.storeexist = false;
    this.inventories.forEach(el => {
      if (el.storeid == this.processinfo.store) {
        console.log(el.data);

        this.storeexist = true;
        this.isexist = false;
        el.data.forEach(element => {
          console.log("element.id :", element.id, ":", element);

          if (element.id == item.id) {
            this.isexist = true;
            element.avb = element.avb + parseInt(item.avb);
            element.rsv = element.rsv + parseInt(item.rsv);
            element.com = element.com + parseInt(item.com);
          }
        });
        if (!this.isexist) {
          item.avb = parseInt(item.avb);
          item.id = parseInt(item.id);
          item.rsv = parseInt(item.rsv);
          item.com = parseInt(item.com);
          el.data.push(item);
        }
      }
    });
    if (!this.storeexist) {
      this.items = [];
      console.log("not exisit");
      // this.new.push(this.processinfo.store);

      this.inventroy.storeid = Number(this.processinfo.store);
      // [{ avb: number; id: number; rsv: number; com: number; }]
      console.log(this.inventroy);
      this.new.push(this.processinfo.store);
      this.item.avb = parseInt(item.avb);
      this.item.id = parseInt(item.id);
      this.item.rsv = parseInt(item.rsv);
      this.item.com = parseInt(item.com);
      this.items.push(this.item);
      this.inventroy.data = JSON.stringify(this.items); console.log('inv.data  :' + this.inventroy);
      console.log(this.inventroy);
      this._hs.post('inventory', this.inventroy).subscribe(res => {

        this._ss.setSnackBar('inserted page is refreshed for you');
        this.getInventories();

      });
    }

    this.istouched = false;
    this.touched.forEach(element => {
      if (element == this.processinfo.store && (this.storeexist == true)) {
        this.istouched = true;
      }
    });
    if (!this.istouched) {
      this.touched.push(this.processinfo.store);
    }



    this.item = {
      id: 0,
      avb: 0,
      rsv: 0,
      com: 0
    };



  }

  viewItems(list: any[], storeid, type, index) {
    this.items = [];
    this.items = list;
    this.entrytype = type;
    if (storeid != "") {
      this.display = this.getstorename(storeid);
      this.actionstore = storeid;
      this.actionindex = index;
    }


    // console.log(this.display);

  }

  openinsertitem(type) {
    this.items = [];

    this.entrytype = type;


  }

  getstorename(id): string {

    this.result = "";
    this.storeselect.forEach(element => {
      if (element.id == id) {


        this.result = element.titlear;

      }

    });
    return this.result;
  }

  getproductname(id): string {

    this.result = "";
    this.productsview.forEach(element => {
      if (element.id == id) {


        this.result = element.titlear;

      }

    });
    return this.result;
  }

  save() {
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

    this.deleted.forEach(outer => {
      this._hs.delete('inventory',outer.storeid, outer).subscribe(res => {
        this._ss.setSnackBar('inserted page is refreshed for you');
        this.getInventories();
      });
    });

this.touched=[];

    this.touched = [];


  }

  remove(item, i, actionstore) {
    this.items.splice(i, 1);
    this.touched.push(actionstore);
    if (this.items.length == 0) {
      this.deleted.push(this.inventories.find(obj => obj.storeid == actionstore));
      this.inventories.splice(this.actionindex, 1);
      console.log(this.deleted);

    }
  }

}
export interface Item {
  id: number,
  avb: number,
  rsv: number,
  com: number
}
