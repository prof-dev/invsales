import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.css']
})
export class LookupsComponent implements OnInit {
  public user: any;
  public nodes: any[] = [];
  public lookups: any[]=[];
  public lookupitems: any[]=[];
  public group: any;
  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }

  ngOnInit() {

    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      } else {
        this._hs.get('lookups', 'filter=parent,eq,0')
          .subscribe(res => {
            this.lookups = res.json().lookups;

          })
      }
    });


  }
  setGroup(group) {
    this.group = group;
    this._hs.get('lookups', 'filter=parent,eq,'+group.id)
      .subscribe(res => {
        this.lookupitems = res.json().lookups;
      })
  }

  modify(item){

  }
  delete(item){

  }

  addnew(){
    if (this.group.group=='banks'){
      
    }
  }
}
