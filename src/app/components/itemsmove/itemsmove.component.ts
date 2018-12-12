import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-itemsmove',
  templateUrl: './itemsmove.component.html',
  styleUrls: ['./itemsmove.component.css']
})
export class ItemsmoveComponent implements OnInit {

  public fromstore: number = 0;
  public tostore: number = 0;
  private fromstorejson: any;
  private tostorejson: any;

  public qty: number = 0;
  public qtyinsource: number = 0;
  public qtyintarget: number = 0;

  public selectedItem: any = { id: 0 };
  public items: any[] = [];
  public stores: any[] = [];

  constructor(private _hs: HttpService, private _ss: ShareService) { }

  ngOnInit() {
    this._hs.get('items').subscribe(res => {
      this.items = res.json().items;
    });
    this._hs.get('lookups', 'filter[]=group,eq,store').subscribe(res => {
      this.stores = res.json().lookups;
    });
  }

  sourceSelected() {
    if (this.selectedItem.id == 0) {
      this._ss.setSnackBar('برجاء اختر الصنف المراد نقله اولا قبل المخزن المصدر')
      return;
    }
    this.qtyinsource = 0;
    this._ss.setAppIsBusy(true);
    if (this.fromstore > 0) {
      this._hs.get('inventory', 'filter[]=storeid,eq,' + this.fromstore).subscribe(res => {

        this.fromstorejson = res.json().inventory[0];
        this.fromstorejson.data = JSON.parse(this.fromstorejson.data);
        this.fromstorejson.data.forEach(item => {
          if (item.id == this.selectedItem.id) {
            this.qtyinsource = item.avb;
          }
        });
        this._ss.setAppIsBusy(false);
      });
    }
  }
  targetSelected() {
    if (this.selectedItem.id == 0) {
      this._ss.setSnackBar('برجاء اختر الصنف المراد نقله اولا قبل المخزن الهدف')
      return;
    }
    this.qtyintarget = 0;
    this._ss.setAppIsBusy(true);
    if (this.tostore > 0) {
      this._hs.get('inventory', 'filter[]=storeid,eq,' + this.tostore).subscribe(res => {
        this.tostorejson = res.json().inventory[0];
        console.log('tostorejson: ', this.tostorejson);

        this.tostorejson.data = JSON.parse(this.tostorejson.data);
        this.tostorejson.data.forEach(item => {
          if (item.id == this.selectedItem.id) {
            this.qtyintarget = item.avb;
          }
        });
        this._ss.setAppIsBusy(false);

      });
    }
  }
  moveItems() {
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



  }

  itemSelected(item) {
    this.qtyinsource = 0;
    this.qtyintarget = 0;
    this.fromstore = 0;
    this.tostore = 0;
    this.qty = 0;
    this.selectedItem = item;
  }
}
