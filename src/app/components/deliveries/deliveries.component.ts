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
  public itemsLookup:any[]=[];
  public delivery: any = {};
  public items: any[] = [];
  public ref: any = {};
  public suppcusname:string;
  public result: any;
 public suppcus: any;
  constructor(private _hs: HttpService,
    private _ss: ShareService, private _ut: UtilsService, private _ar: ActivatedRoute,
    private _router: Router) {

  }

  ngOnInit() {
    this.loadItems();
  }


  loadItems(){

    this._hs.get('items').subscribe(res=>
      {
        console.log(res.json());
        
        this.itemsLookup=res.json().items;
      });
  

  }

  getItems() {
    console.log('here');
    console.log(this.delivery.type);
    console.log(this.delivery.ref);

    if (this.delivery.type == 'p' || this.delivery.type == 's') {
      this._hs.get('pursales', 'filter[]=id,eq,' + this.delivery.ref).subscribe(res => {
        console.log(res.json().pursales);

        this.ref = res.json().pursales[0];
        this.ref.data = JSON.parse(this.ref.data);
        console.log(this.ref);
        this.setsupcusname(this.ref.suppcusid);
        this.prepareItems();



      });

    } else
      if (this.delivery.type == 'rp' || this.delivery.type == 'rs') {
        this._hs.get('pursalesret', 'filter[]=id,eq,' + this.delivery.ref).subscribe(res => {
          this.ref = res.json().pursalesret[0];
          this.ref.data = JSON.parse(this.ref.data);
          console.log(this.ref);
          
          this.prepareItems();


        });
      }
      else if (this.delivery.type == 'fp' || this.delivery.type == 'tp') {
        this._hs.get('storetostore', 'filter[]=id,eq,' + this.delivery.ref).subscribe(res => {
          this.ref = res.json().storetostore[0];
          this.ref.data = JSON.parse(this.ref.data);
          console.log(this.ref);
          
          this.prepareItems();


        });
      }



  }

  prepareItems() {
    this.ref.data.items.forEach(element => {
      let item = { qty: 0, id: 0, delivered: 0, note: "",name:"" };
      item.qty = element.count;
      item.id = element.id;
      item.delivered = 0;
      item.note = "";
      item.name=element.titlear;
      this.items.push(item);
    });

  }
  reset() {
    this.items = [];
    this.ref = {};

  }
  setsupcusname(id) {
    console.log(id);
    
    this._hs.get('suppcus','filter[]=id,eq,'+id).subscribe(res=>{
      this.suppcus=res.json().suppcus[0];
      console.log(res.json().suppcus);
      this.suppcusname=this.suppcus.namear;
      
    })
    

  }
  insertMovement() {

  }

  // getAllItems(type):any{


  // }

  public types: Choice[] = [
    { value: 'p', viewValue: 'إستلام مشتريات' },
    { value: 's', viewValue: 'تسليم مبيعات' },
    { value: 'rs', viewValue: 'إستلام مردودات مبيعات' },
    { value: 'rp', viewValue: 'تسليم مردودات مشتريات' },
    { value: 'fs', viewValue: 'إستلام  بضاعة من مخزن آخر' },
    { value: 'ts', viewValue: 'تسليم  بضاعة إلى مخزن آخر' },



  ]
}
