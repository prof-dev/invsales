import { Component, OnInit, ViewChild } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spendings',
  templateUrl: './spendings.component.html',
  styleUrls: ['./spendings.component.css']
})
export class SpendingsComponent implements OnInit {
  @ViewChild('date')
  public date: any;
  public user: any;
  public spendingtype: any[] = [];
  public treasuries: any[] = [];
  public spending={
    id:0,
    lookupsid:"",
    data:"",
    amount:0.00,
    usersid:0

  };
  public data={ 
    tresury:0,
    desc:""
  };
  public canselect=false;

  constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router) { }

  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
    });
    if (this.user == null || this.user.id == 0 ) {
      this._router.navigateByUrl('/login');
    }
    if(!(this.user.roles.indexOf('a') < 0)){
      this.canselect=true;
    }
    this.getspending();
    this.gettreasuries();
    
  }

  getspending() {
    this._hs.get('lookups', 'filter=group,eq,spending')
      .subscribe(res => {
        this.spendingtype = res.json().lookups;
        
         this.spendingtype = this.spendingtype.filter(obj => obj.parent != 0 );

      });
  }

  gettreasuries() {
    this._hs.get('lookups', 'filter=group,eq,tresuries')
      .subscribe(res => {
        this.treasuries = res.json().lookups;
        this.treasuries = this.treasuries.filter(obj => obj.parent != 0 );

      });
  }

  reset(){
     this.spending={
      id:0,
      lookupsid:"",
      data:"",
      amount:0.00,
      usersid:0
  
    };
     this.data={ 
      tresury:0,
      desc:""
    };

  }

  save(){
    this.spending.usersid=this.user.id;
    this.spending.data=JSON.stringify(this.data);
    this._hs.post('spending', this.spending).subscribe(res => {
      if(this.canselect){
        this.updatetreasurybalance();
      }
      else{
        this.updateuseraccount();
      }
    
    });

  }

  updateuseraccount(){
    this.user.balance =Number(this.user.balance) - Number(this.spending.amount);
    this._hs.put('users',"id", this.user).subscribe(res2 => {
      this._ss.setSnackBar("تم  تعديل رصيد المستخدم  ");
    });
  }

  updatetreasurybalance(){
    this.treasuries.forEach(element => {
      if(element.id==this.data.tresury){
        element.data=JSON.parse(element.data);
        element.data.balance=Number(element.data.balance) - Number(this.spending.amount);
        element.data=JSON.stringify(element.data);
        this._hs.put('lookups',"id", element).subscribe(res2 => {
          this._ss.setSnackBar("تم  تعديل رصيد الخزينة  ");
        });
      }
    });

  }

}
