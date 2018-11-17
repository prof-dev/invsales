import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { Banks, Tresuries } from 'src/app/classes/Lookup';

@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.css']
})
export class LookupsComponent implements OnInit {
  public user: any;
  public nodes: any[] = [];
  public lookups: any[] = [];
  public lookupitems: any[] = [];
  public group: any=null;
  public visible: boolean;
  
  public bank={
    group:"",
    id:null,
    parent:0,
    isleaf:0,
    titleen:"",
    titlear:"",
    data:null
  };

  public data={
    address:"",balance:0
  }
  public tresury: Tresuries;

  
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
            console.log(this.lookups);
            

          })
      }
    });


  }
  setGroup(group) {
    this.group = group;
    this._hs.get('lookups', 'filter=parent,eq,' + group.id)
      .subscribe(res => {
        this.lookupitems = res.json().lookups;
      })
      this.visible=true;
 
  }

  modify(item) {

  }
  delete(item) {

  }

  addnew() {
    this.bank.titlear="fs";
    this.data.address="";
    this.visible = false;
    document.getElementById('addNew').style.visibility="visible";
    if (this.group.group == 'banks') {
      this.bank.group='bank';
      this.bank.parent=this.group.id;
      
      

    }
  }

  save(item){
    if(item.id==null){
      item.data=JSON.stringify(this.data);
      console.log(item.data);
      
      this._hs.post('lookups',item) .subscribe(res => {

        confirm("تمت إضافة "+this.group.titlear+" id :"+res);

      })
          
     
    }
  }
}
