import { Component, OnInit } from '@angular/core';
import { Choice } from '../sadad/sadad.component';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  public itemsLookup: any[] = [];
  public delivery: any = {};
  public items: any[] = [];
  public ref: any = {};
  public suppcusname: string;
  public result: any;
  public suppcus: any;
  public storelookups: any;
  constructor(private _hs: HttpService,
    private _ss: ShareService, private _ut: UtilsService, private _ar: ActivatedRoute,
    private _router: Router) {

  }

  ngOnInit() {
    this.loadItems();
    this.loadStores();
  }
  loadStores() {
    this._hs.get('lookups','filter[]=group,eq,stores').subscribe(res => {
      this.storelookups= res.json().lookups;
      this.storelookups=this.storelookups.filter(obj=> obj.parent!=0);
      this.storelookups.forEach(element => {
        element.data=JSON.parse(element.data);
      });
    });
  }

  loadItems() {

    this._hs.get('items').subscribe(res => {
      console.log(res.json());

      this.itemsLookup = res.json().items;
    });


  }

  getItems() {
    this.reset();
    console.log('here');
    console.log(this.delivery.type);
    console.log(this.delivery.ref);

    if (this.delivery.type == 'p' || this.delivery.type == 's') {
      this._hs.get('pursales', 'filter[]=id,eq,' + this.delivery.ref + '&filter[]=type,eq' + this.delivery.type + '&satisfy=all').subscribe(res => {
        console.log(res.json().pursales);

        this.ref = res.json().pursales[0];
        this.ref.data = JSON.parse(this.ref.data);
        console.log(this.ref);
        this.setsupcusname(this.ref.suppcusid);
        if (this.ref.complete != 0) {
          this.prepareItems();
          this.delivery.pursalesid=this.ref.id;

        }
        else if (this.ref != null) {
          this._ss.setSnackBar('تم إغلاق هذا المرجع');
        }

      });

    } else
      if (this.delivery.type == 'rp' || this.delivery.type == 'rs') {
        this._hs.get('pursalesret', 'filter[]=id,eq,' + this.delivery.ref).subscribe(res => {
          this.ref = res.json().pursalesret[0];
          this.ref.data = JSON.parse(this.ref.data);
          if (this.ref.complete != 0) {
            this.prepareItems();
            this.delivery.pursalesretid=this.ref.id;

          }
          else if (this.ref != null) {
            this._ss.setSnackBar('تم إغلاق هذا المرجع');
          }


        });
      }
      else if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
        this._hs.get('storetostore', 'filter[]=id,eq,' + this.delivery.ref).subscribe(res => {
          this.ref = res.json().storetostore[0];
          this.ref.data = JSON.parse(this.ref.data);
          console.log(this.ref);
          if (this.ref.complete != 0) {
            this.prepareItems();
            this.delivery.storetostoreid=this.ref.id;

          }
          else if (this.ref != null) {
            this._ss.setSnackBar('تم إغلاق هذا المرجع');
          }


        });
      }



  }

  prepareItems() {
    let item = { qty: 0, id: 0, delivered: 0, note: "", name: "" };
    if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
      this.ref.data.forEach(element => {
        item.qty = element.qty;
        item.id = element.id;
        item.delivered = 0;
        item.note = "";
        item.name = this.itemsLookup.find(obj => obj.id === element.id).namear;
        this.items.push(item);
      });

    }
    else {
      this.ref.data.items.forEach(element => {

        item.id = element.id;
        item.delivered = 0;
        item.note = "";
        item.name = this.itemsLookup.find(obj => obj.id === element.id).namear;
        if (element.qty != null) {
          item.qty = element.qty;

        }
        else {
          item.qty = element.count;

        }

        this.items.push(item);
      });
    }


  }
  reset() {
    this.items = [];
    this.ref = {};

  }
  setsupcusname(id) {
    console.log(id);

    this._hs.get('suppcus', 'filter[]=id,eq,' + id).subscribe(res => {
      this.suppcus = res.json().suppcus[0];
      console.log(res.json().suppcus);
      this.suppcusname = this.suppcus.namear;

    })


  }
  verify(row) {
    if (row.delivered > row.qty) {
      this._ss.setSnackBar('لا يمكن تسليم كمية أكبر من كمية الصنف في الفاتورة');
    }
  }

  changeAvbOnStock() {

  }




  public types: Choice[] = [
    { value: 'p', viewValue: 'إستلام مشتريات' },
    { value: 's', viewValue: 'تسليم مبيعات' },
    { value: 'rs', viewValue: 'إستلام مردودات مبيعات' },
    { value: 'rp', viewValue: 'تسليم مردودات مشتريات' },
    { value: 'fs', viewValue: 'إستلام  بضاعة من مخزن آخر' },
    { value: 'ts', viewValue: 'تسليم  بضاعة إلى مخزن آخر' },



  ]
}
