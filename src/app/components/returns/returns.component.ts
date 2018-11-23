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

  public returns: any = {
    id: 0,
    type: '',
    data: []
  }
  public invData: any[] = [
    { itemid: 21, qty: 14, rsv: 14, return: 0 },
    { itemid: 52, qty: 11, rsv: 14, return: 0 },
    { itemid: 73, qty: 104, rsv: 14, return: 0 },
    { itemid: 14, qty: 414, rsv: 14, return: 0 },
    { itemid: 52, qty: 124, rsv: 14, return: 0 },
    { itemid: 16, qty: 12, rsv: 14, return: 0 },
  ];
  public poData: any[] = [
    { itemid: 121, qty: 114, return: 0 },
    { itemid: 522, qty: 121, return: 0 },
    { itemid: 53, qty: 14, return: 0 },
    { itemid: 74, qty: 44, return: 0 },
    { itemid: 51, qty: 24, return: 0 },
    { itemid: 17, qty: 52, return: 0 },
  ];

  constructor(private _hs: HttpService, private _ss: ShareService, private _ut: UtilsService) { }

  ngOnInit() {

  }

  fetch() {
    this._ss.setAppIsBusy(true);
    this._hs.get('pursalesret', 'filter=poinvid,eq,' + this.returns.id)
      .subscribe(res => {
        if (res.json().pursalesret.length == 0) {
          this._hs.get('pursales', 'filter=id,eq,' + this.returns.id)
            .subscribe(res2 => {
              if (res2.json().pursales.length == 0) {
                this._ss.setSnackBar('لا يوجد هذا الرقم في النظام')
              } else {
                if (this.returns.type == 's')
                  this.returns.data = this.invData;
                else
                  this.returns.data = this.poData;
              }
              this._ss.setAppIsBusy(false);

            });
        } else {
          if (this.returns.type == 's')
            this.returns.data = this.invData;
          else
            this.returns.data = this.poData;
        }
        this._ss.setAppIsBusy(false);
      });
  }
  save() {
    this._ss.setAppIsBusy(true);
    console.log('data', JSON.stringify(this.poData));
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
}
