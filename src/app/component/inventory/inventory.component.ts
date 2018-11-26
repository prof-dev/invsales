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
  public items: any[] = [];
  public item: any = {};
  public inventroy = {
    storeid: 0,
    data: null
  }
  public stores:any[]=[];
  public inventories: any[] = [];
  store: any;
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
          this.inventories.forEach(element => {
            element.data = JSON.parse(element.data);
          });
        });
        ///////  retrieve all the stores by the group name of the parent
      this._hs.get('lookups', 'filter=group,eq,stores')
        .subscribe(res => {
          this.store = res.json().lookups;
        });
      this._hs.get('lookups', 'filter=parent,eq,'+this.store[0].id)
        .subscribe(res => {
          this.stores = res.json().lookups;
        })
    });
  }

  additemtolist(item) {
    this.items.push(item);
    this.item = {
      id: 0,
      avb: 0,
      rsv: 0,
      com: 0
    };
  }




}
