import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  public retOb: ReturnsObject;
  public invData: any[] = [
    { id: 1, qty: 14, return: 0 },
    { id: 2, qty: 11, return: 0 },
    { id: 3, qty: 104, return: 0 },
  ];

  constructor(private _hs: HttpService, private _ss: ShareService, private _ut: UtilsService) {
    this.retOb = new ReturnsObject(this._hs);
  }

  ngOnInit() {

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
          this._hs.get('pursalesret', 'filter[]=poinvid,eq,' + this.retOb.id + '&filter[]=type,eq,' + this.retOb.type + '&satisfy=all')
            .subscribe(res2 => {
              if (res2.json().pursalesret.length == 1) {
                this.retOb.row = res2.json().pursalesret[0];
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
    this._ss.setAppIsBusy(true);
    this.retOb.saveApplication().subscribe(res => {
      console.log('res of save: ', res.json());
      this._ss.setAppIsBusy(false);
    });
  }
  delivered() {
    this._ut.messageBox('confirm', 'اسنلام مردودات', 'هل فعلا تم اسنلام المردودات؟؟')
      .afterClosed()
      .subscribe(res => {
        if (res == 'ok') {
          //confirm here
        }
      });
  }
  print() {
    this._hs.log('user1','tbl1','c','screen x','so and so');
    this._ut.showReport('طلب مردودات المبيعات', 'printdiv');
  }
}

export class ReturnsObject {
  public id: number;
  public type: string;
  public row: any = {};
  private itemsids: number[];
  public inrets: boolean;
  public ready: boolean;
  constructor(private _ht: HttpService) {
    this.id = 0;
    this.type = 's';
    this.row = {};
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
    therow.poinvid = therow.id;
    therow.locked = 0;
    therow.data.forEach(itm => {
      delete itm.name;
    });

    therow.data = JSON.stringify(therow.data);
    console.log('the row: ', therow);
    console.log('ret ob: ', this);
    if (this.ready) {
      if (this.inrets) {
        return this._ht.put('pursalesret', 'id', therow);
      } else {
        delete this.id;
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