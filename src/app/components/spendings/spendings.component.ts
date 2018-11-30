import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spendings',
  templateUrl: './spendings.component.html',
  styleUrls: ['./spendings.component.css']
})
export class SpendingsComponent implements OnInit {
  public user: any;
  public spendingtype: any[] = [];
  public treasuries: any[] = [];
  public spending={
    type:"",
    tresury:0
  };

  constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router) { }

  ngOnInit() {
    this.getspending();
    this.gettreasuries()
  }

  getspending() {
    this._hs.get('lookups', 'filter=group,eq,spending')
      .subscribe(res => {
        this.spendingtype = res.json().lookups;
        
        // this.spendingtype = this.lookups.map(stores => ({ id: stores.id, titlear: stores.titlear }));

      });
  }

  gettreasuries() {
    this._hs.get('lookups', 'filter=group,eq,tresuries')
      .subscribe(res => {
        this.treasuries = res.json().lookups;
        

      });
  }

  reset(){
     this.spending={ type:"",    tresury:0};

  }
  save(){

  }

}
