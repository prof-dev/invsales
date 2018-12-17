import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-itemsmove',
  templateUrl: './itemsmove.component.html',
  styleUrls: ['./itemsmove.component.css']
})
export class ItemsmoveComponent implements OnInit {

  public fromstore: any = { id: 0 };
  public tostore: any = { id: 0 };
  public qty: number = 0;
  public qtyinsource: number = 0;
  public qtyintarget: number = 0;
  public selectedItem: any = { id: 0 };
  public sourceitems: any[] = [];
  public stores: any[] = [];
  public user: any = { id: 0 };

  public storetostore = { id: 0, fromstore: 0, tostore: 0, data: [], usersid: this.user.id, complete: 0 };
  constructor(private _rt: Router, private _hs: HttpService, private _ss: ShareService, private _ut: UtilsService) { }

  ngOnInit() {
    this._hs.get('lookups', 'filter[]=group,eq,store').subscribe(res => {
      this.stores = res.json().lookups;
    });
    this._ss.User.subscribe(user => {
      this.user = user;
    });
    // if (this.user.id == 0 || this.user.roles.indexOf('s;') < 0) {
    //   this._rt.navigateByUrl('/login');
    // }
  }
  fetchOrder() {
    this._ss.setAppIsBusy(true);
    this._hs.get('storetostore', 'filter=id,eq,' + this.storetostore.id).subscribe(res => {
      console.log('result of fecth: ', res.json());
      if (res.json().storetostore.length == 0) {
        this.newOrder();
      } else {
        this.storetostore = res.json().storetostore[0];
        this.storetostore.data = JSON.parse(res.json().storetostore[0].data);
        this.fromstore = this.stores.find(one => { return one.id == this.storetostore.fromstore; });
        this.tostore = this.stores.find(one => { return one.id == this.storetostore.tostore; });
        this.sourceSelected();
        this.targetSelected();
      }
      this._ss.setAppIsBusy(false);
    });
  }
  newOrder() {
    this.storetostore = { id: 0, fromstore: 0, tostore: 0, data: [], usersid: this.user.id, complete: 0 };
    this.sourceitems = [];
    this.qty = 0;
    this.fromstore = null;
    this.tostore = null;
  }

  sourceSelected() {
    this.storetostore.data=[];
    this.qtyinsource = 0;
    console.log('from store: ', this.fromstore);
    
    if (this.fromstore.id > 0) {
      this._ss.setAppIsBusy(true);
      this._hs.get('inventory', 'filter=id,eq,' + this.fromstore.id).subscribe(res => {
        console.log('res: ', res.json());
        
        if (res.json().inventory.length == 1) {
          this.fromstore.data = JSON.parse(res.json().inventory[0].data);
          console.log('source store with items: ', this.fromstore);
          this.fromstore.data.forEach(item => {
            this._hs.get('items', 'filter=id,eq,' + item.id).subscribe(itemres => {
              item.namear = itemres.json().items[0].namear;
            });
          });
          this.sourceitems = this.fromstore.data;
        }
        this._ss.setAppIsBusy(false);
      });
    }

  }
  targetSelected() {
    this.storetostore.data=[];
    this.qtyintarget = 0;
    this._ss.setAppIsBusy(true);
    if (this.tostore.id > 0) {
      this._hs.get('inventory', 'filter[]=id,eq,' + this.tostore.id).subscribe(res => {
        if (res.json().inventory.length == 1) {
          this.tostore.data = JSON.parse(res.json().inventory[0].data);
          this.tostore.data.forEach(item => {
            this._hs.get('items', 'filter=id,eq,' + item.id).subscribe(itemres => {
              item.namear = itemres.json().items[0].namear;
            });
          });
          console.log('target store with items: ', this.tostore);
        }
        this._ss.setAppIsBusy(false);
      });
    }

  }
  print() {
    this._ut.showReport('نقل اصناف بين المخازن');
  }
  addItem() {
    if (this.qtyinsource == 0) {
      this._ss.setSnackBar('هذا الصنف غير موجود في المخزن المصدر');
      return;
    }
    if (this.qty <= 0) {
      this._ss.setSnackBar('الكميه المراد نقلها صفر أو أقل من صفر. برجاء اكتب كميه أكبر من صفر');
      return;
    }
    if (this.qtyinsource < this.qty) {
      this._ss.setSnackBar('لا يمكن نقل كميه أكبر من الموجود في المخزن');
      return;
    }
    if (this.storetostore.data.find(one => { return one.id == this.selectedItem.id })) {
      this._ss.setSnackBar('لقد اضفت هذا الصنف سابقاً');
      return;
    }
    this.storetostore.data.push({ id: this.selectedItem.id, namear: this.selectedItem.namear, qty: this.qty })
  }
  deleteItem(idx) {
    this.storetostore.data.splice(idx, 1);
  }
  moveItems() {
    if (this.fromstore.id == this.tostore.id) {
      this._ss.setSnackBar('لا يمكن نقل الأصناف لنفس المخزن');
      return;
    }
    if (this.storetostore.data.length == 0) {
      this._ss.setSnackBar('لم تقم باضافه اي صنف');
      return;
    }
    let mstoretostore = JSON.parse(JSON.stringify(this.storetostore));
    mstoretostore.fromstore = this.fromstore.id;
    mstoretostore.tostore = this.tostore.id;
    mstoretostore.usersid = this.user.id;
    mstoretostore.data = JSON.stringify(mstoretostore.data);
    console.log('mstoretostore: ', mstoretostore);

    this._ss.setAppIsBusy(true);
    if (mstoretostore.id == 0) {
      delete mstoretostore.id;
      this._hs.post('storetostore', mstoretostore).subscribe(res => {
        if (res.json() > 0) {
          this._ss.setSnackBar('تمت العمليه بنجاح');
        } else {
          this._ss.setSnackBar('لم تتم العمليه بنجاح');
        }
        this._ss.setAppIsBusy(false);
      });
    } else {
      this._hs.put('storetostore', 'id', mstoretostore).subscribe(res => {
        if (res.json() > 0) {
          this._ss.setSnackBar('تمت العمليه بنجاح');
        } else {
          this._ss.setSnackBar('لم تتم العمليه بنجاح');
        }
        this._ss.setAppIsBusy(false);
      });
    }

  }

  itemSelected(item) {
    this.selectedItem = item;
    this.showQty();
  }
  private showQty() {
    if (this.fromstore.id > 0 && this.tostore.id > 0 && this.selectedItem.id > 0) {
      this.fromstore.data.forEach(one => {
        if (one.id == this.selectedItem.id) {
          this.qtyinsource = one.avb;
        }
      });
      this.tostore.data.forEach(one => {
        if (one.id == this.selectedItem.id) {
          this.qtyintarget = one.avb;
        }
      });
    } else {
      this._ss.setSnackBar('برجاء اختيار المخزن المصدر والمخزن الهدف والصنف')
    }
  }
}
