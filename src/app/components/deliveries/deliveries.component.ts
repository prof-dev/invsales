import { Component, OnInit } from '@angular/core';
import { Choice } from '../sadad/sadad.component';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InventoryClass } from 'src/app/services/classes';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  public invetoryObj: InventoryClass;
  public itemsLookup: any[] = [];
  public delivery: any = {};
  public items: any[] = [];
  public ref: any = {};
  public suppcusname: string;
  public result: any;
  public suppcus: any;
  public storelookups: any;
  public user: any;
  public userstores: any[] = [];
  public invItems: any[] = [];
  public inventory: any = {};
  constructor(private _hs: HttpService,
    private _ss: ShareService, private _ut: UtilsService, private _ar: ActivatedRoute,
    private _router: Router) {
    this.invetoryObj = new InventoryClass(_hs, _ss);

  }

  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
      this.userstores = this.user.stores;
      console.log("userstore :", this.userstores);

      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      }
      this.loadItems();
      this.loadStores();
    });
  }
  loadStores() {
    if (this.user.stores != null) {
      this._hs.get('lookups', 'filter[]=group,eq,stores').subscribe(res => {

        this.storelookups = res.json().lookups;
        console.log(this.storelookups);

        this.storelookups = this.storelookups.filter(obj => obj.parent != 0);
        console.log(this.storelookups);
        console.log('userinfo', this.user);

        this.storelookups = this.storelookups.filter(obj => this.storelookups.find(st => this.userstores.includes(obj.id)));
        console.log(this.storelookups);
      });
    }

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
    //this.invetoryObj.getStoreItemsQty(this.delivery.lookupsid
    this._hs.get('inventory', 'filter[]=id,eq,' + this.delivery.lookupsid).subscribe(
      res => {
        this.inventory = res.json().inventory[0];
        this.inventory.data = JSON.parse(this.inventory.data);
      }
    );
    console.log(this.inventory);



    if (this.delivery.type == 'p' || this.delivery.type == 's') {
      this._hs.get('pursales', 'filter[]=id,eq,' + this.delivery.ref + '&filter[]=type,eq' + this.delivery.type + '&satisfy=all').subscribe(res => {
        console.log(res.json().pursales);

        this.ref = res.json().pursales[0];
        this.ref.data = JSON.parse(this.ref.data);
        console.log(this.ref);
        this.setsupcusname(this.ref.suppcusid);
        this.prepareItems();
        this.delivery.pursalesid = this.ref.id;



      });

    } else
      if (this.delivery.type == 'rp' || this.delivery.type == 'rs') {
        this._hs.get('pursalesret', 'filter[]=id,eq,' + this.delivery.ref).subscribe(res => {
          this.ref = res.json().pursalesret[0];
          this.ref.data = JSON.parse(this.ref.data);

          this.prepareItems();
          this.delivery.pursalesretid = this.ref.id;

        });
      }
      else if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
        this._hs.get('storetostore', 'filter[]=id,eq,' + this.delivery.ref).subscribe(res => {
          this.ref = res.json().storetostore[0];
          this.ref.data = JSON.parse(this.ref.data);
          console.log(this.ref);
          this.prepareItems();
          this.delivery.storetostoreid = this.ref.id;


        });
      }



  }
  save() {
    if (this.verify()) {
      this.updateDLV();
    }
    else {
      this._ss.setSnackBar('لا يمكن تسليم كمية أكبر من كمية المطلوب في الفاتورة');
    }

  }
  prepareItems() {
    if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
      this.invItems = this.ref.data;
      this.invItems.forEach(element => {
        let item = { qty: 0, id: 0, delivered: 0, note: "", name: "", tqty: 0 };

        item.qty = Number(element.qty) - Number(element.dlv);
        item.id = element.id;
        item.delivered = 0;
        item.note = "";
        item.name = this.itemsLookup.find(obj => obj.id == element.id).namear;
        item.tqty = element.qty;
        this.items.push(item);
      });

    }
    else {
      this.invItems = this.ref.data.items;
      this.invItems.forEach(element => {
        let item = { qty: 0, id: 0, delivered: 0, note: "", name: "", tqty: 0 };

        console.log(element);
        item.tqty = element.qty;
        item.qty = Number(element.qty) - Number(element.dlv);
        item.id = element.id;
        item.delivered = 0;
        item.note = "";
        item.name = this.itemsLookup.find(obj => obj.id == element.id).namear;
        this.items.push(item);
      });
    }
    console.log("this.items :", this.items);



  }
  reset() {
    this.items = [];
    this.ref = {};
    this.invItems = [];

  }
  setsupcusname(id) {
    console.log(id);

    this._hs.get('suppcus', 'filter[]=id,eq,' + id).subscribe(res => {
      this.suppcus = res.json().suppcus[0];
      console.log(res.json().suppcus);
      this.suppcusname = this.suppcus.namear;

    })


  }
  verify(): boolean {
    let result = true;
    this.items.forEach(element => {
      if (Number(element.delivered) > Number(element.qty)) {
        this._ss.setSnackBar('لا يمكن تسليم كمية أكبر من كمية المطلوب في الفاتورة');
        result = false;
      }

    });
    return result;

  }

  updateDLV() {

    this.updateInvoice();
  }

 
  updateInvoice() {

    this.items.forEach(element => {
    
      this.delivery.notes = element.note;
      this.delivery.qty = element.delivered;
      this.delivery.invoiceqty = element.tqty;
      this.delivery.itemsid = element.id;
      this.inventory.data.forEach(store => {
        if( this.delivery.itemsid==store.id){
          this.delivery.storeavb=store.avb;
        }
      });

      console.log("inventory :"+JSON.stringify(this.delivery));
      

      if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
        this.ref.storetostoreid = this.ref.id;
      } else if (this.delivery.type == 'rp' || this.delivery.type == 'rs') {
        this.ref.pursalesid = this.ref.id;
      } else if (this.delivery.type == 'p' || this.delivery.type == 's') {
        this.ref.pursalesretid = this.ref.id;

      }
      if (this.delivery.qty > 0) {
        this._hs.post('itemmov', this.delivery).subscribe(res => {
          this._ss.setSnackBar('تم حفظ حركة المخزن للعنصر' + element.name);
        })
      }

      this.invItems.forEach(inv => {
        if (element.id == inv.id) {
          inv.dlv = Number(inv.dlv) + Number(element.delivered);

        }
      });

    });

    this.ref.complete = this.closeRef();
    if (this.ref.complete == 1) {
      this._ss.setSnackBar("تم تسليم جميع العناصر وقفل المرجع ");
    }

    if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
      this.ref.data = this.invItems;
    } else {
      this.ref.data.items = this.invItems;
    }
    this.ref.data = JSON.stringify(this.ref.data);

    if (this.delivery.type == 'p' || this.delivery.type == 's') {
      this._hs.put('pursales', 'id', this.ref).subscribe(res => {
      });

    } else
      if (this.delivery.type == 'rp' || this.delivery.type == 'rs') {
        this._hs.put('pursalesret', 'id', this.ref).subscribe(res => {
        });
      }
      else if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
        this._hs.put('storetostore', 'id', this.ref).subscribe(res => {
        });
      }
    this._ss.setSnackBar("تم تعديل بيانات تسليم العناصر للمرجع");


  }

  closeRef(): number {
    let close: number = 1;
    if (this.delivery.type == 'fs' || this.delivery.type == 'ts') {
      this.invItems.forEach(element => {
        if (Number(element.dlv) < Number(element.qty)) {
          close = 0;
        }
      });
    }
    else {
      this.invItems.forEach(element => {
        if (Number(element.dlv) < Number(element.qty)) {
          close = 0;
        }
      });

    }
    return close;
  }

  changeAvbOnStock() {
    this.items.forEach(element => {
      this.invetoryObj.getStoreItemsQty(element.lookupsid).forEach(inner => {
        if (Number(element.delivered) < Number(inner.qty) && this.delivery.type == 'out') {

        }
        else if (this.delivery.type == 'out') {

        }
        else if (this.delivery.type == 'in') {

        }
        else if (this.delivery.type == 'in') {

        }
      });

    });

  }

  print() {
    this._hs.log(this.user.id, 'tbl1', 'c', ' المخازن', 'so and so');

    this._ut.showReport('الأصناف المسلمة / المستلمة');
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
