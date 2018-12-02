import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  public retOb: ReturnsObject;
  public user:any={
    id:0,
    roles:'x'
  };
  public invData: any[] = [
    { id: 1, qty: 14, return: 0 },
    { id: 2, qty: 11, return: 0 },
    { id: 3, qty: 104, return: 0 },
  ];

  constructor(private _hs: HttpService, private _ss: ShareService, private _ut: UtilsService, private _router:Router) {
    this.retOb = new ReturnsObject(this._hs);
  }

  ngOnInit() {
    this._ss.User.subscribe(user=>{
      this.user = user;
    });
    if (this.user.id==0){
      this._router.navigateByUrl('/login');
    }
  }

  fetch() {
    this.retOb.reset();
    this._ss.setAppIsBusy(true);
    this._hs.get('pursalesret', 'filter[]=id,eq,' + this.retOb.id + '&filter[]=type,eq,' + this.retOb.type + '&satisfy=all')
      .subscribe(res => {
        if (res.json().pursalesret.length == 1) {
          this.retOb.row = res.json().pursalesret[0];
          this.retOb.inrets = true;
          this.prepareRetOb();
          this._ss.setAppIsBusy(false);
        } else {
          this._hs.get('pursales', 'filter[]=id,eq,' + this.retOb.id + '&filter[]=type,eq,' + this.retOb.type + '&satisfy=all')
            .subscribe(res3 => {
              if (res3.json().pursales.length == 1) {
                this.retOb.row = res3.json().pursales[0];
                this.prepareRetOb();
              } else {
                this._ss.setSnackBar('لا يوجد هذا الرقم في النظام')
              }
              this._ss.setAppIsBusy(false);
            });
        }
      });
  }
  prepareRetOb() {
    this.retOb.row.data = JSON.parse(this.retOb.row.data);
    this.retOb.buildItemsIds();
    this.retOb.getItems().subscribe(res => {
      this.retOb.fixItems(res.json().lookups);
    });
  }


  save() {
    if (this.retOb.row.locked == 1) {
      this._ss.setSnackBar('هذا الطلب مغلق تماما');
      return;
    }
    var qtyerror=0;
    this.retOb.row.data.forEach(itm => {
      if (itm.qty-itm.return<0){
        qtyerror=1;
      }
    });
    if (qtyerror==1){
      this._ss.setSnackBar('لا يمكن للكميه المرتجعه ان تكون اكبر من الكميه نفسها!!!');
      return;
    }
    this._ss.setAppIsBusy(true);
    this.retOb.saveApplication().subscribe(res => {
      if (res.json() > 0) {
        this._ss.setSnackBar('تمت عمليه الحفظ بنجاح');
      }
      this._ss.setAppIsBusy(false);
    });
  }
  delivered() {
    if (this.retOb.row.locked == 1) {
      this._ss.setSnackBar('هذا الطلب مغلق تماما');
      return;
    }
    this._ut.messageBox('confirm', 'اسنلام مردودات', 'هل فعلا تم اسنلام المردودات؟؟')
      .afterClosed()
      .subscribe(res => {
        if (res == 'ok') {
          this._ss.setAppIsBusy(true);
          var xrow = JSON.parse(JSON.stringify(this.retOb.row));
          xrow.locked = 1;
          xrow.data = JSON.stringify(xrow.data);
          console.log('the row before putting:', xrow);
          this._hs.put('pursalesret', 'id', xrow).subscribe(res => {
            if (res.json() > 0) {
              this.retOb.row.locked = 1;
              this._ss.setAppIsBusy(true);
              this._ss.setSnackBar('تمت عمليه غلق طلب الارجاع للابد لا تستطيع بعد اليوم التغيير فيه')
            }
          });
        }
      });
  }
  print() {
    this._hs.log('user1', 'tbl1', 'c', 'screen x', 'so and so');
    this._ut.showReport('طلب مردودات المبيعات', 'printdiv');
  }
  delete() {
    if (this.retOb.row.locked == 1) {
      this._ss.setSnackBar('هذا الطلب مغلق تماما');
      return;
    }
    this._ut.messageBox('confirm', 'حذف طلب رد', 'هل فعلا تريد حذف طلب الر هذا؟؟')
      .afterClosed()
      .subscribe(dialog => {
        if (dialog == 'ok') {
          this._ss.setAppIsBusy(true);
          this._hs.delete('pursalesret', this.retOb.row.id, this.retOb.row).subscribe(res => {
            if (res.json() == 1) {
              this._ss.setSnackBar('تمت عمليه حذف طلب الرد بنجاح');
              this.retOb.reset();
            }
            this._ss.setAppIsBusy(true);
          });
        }
      });
  }
}

export class ReturnsObject {
  public id: number;
  public type: string;
  public name:string;
  public row: any = {};
  private itemsids: number[];
  public inrets: boolean;
  public ready: boolean;
  constructor(private _ht: HttpService) {
    this.id = 0;
    this.type = 's';
    this.row = {};
    this.name='';
    this.itemsids = [0];
    this.inrets = false;
    this.ready = false;
  }
  reset() {
    this.row = {};
    this.itemsids = [0];
    this.inrets = false;
    this.ready = false;
  }
  buildItemsIds() {
    this.row.data.forEach(itm => {
      this.itemsids.push(itm.id);
    });
  }
  getItems() {
    return this._ht.get('lookups', 'filter[]=group,eq,item&filter[]=id,in,' + this.itemsids + '&satisfy=all')
  }

  saveApplication() {
    let therow: any = JSON.parse(JSON.stringify(this.row));
    therow.locked = 0;
    therow.data.forEach(itm => {
      delete itm.name;
    });

    therow.data = JSON.stringify(therow.data);
    if (this.ready) {
      if (this.inrets) {
        return this._ht.put('pursalesret', 'id', therow);
      } else {
        delete therow.id;
        return this._ht.post('pursalesret', therow);
      }
    }
  }

  fixItems(items: any[]) {
    this.row.data.forEach(rec => {
      var recitem: any = items.find(el => { return rec.id == el.id });
      if (recitem)
        rec.name = recitem.titlear;
    });
    this.ready = true;
    console.log('this.ready:', this.ready);
  }

}