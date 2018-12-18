import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { UtilsService } from "../../services/utils.service";
import { Router } from '@angular/router';
import { empty } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: any[] = [];
  public page: any[] = [];
  public loggedInUser: any = null;
  public actionUser: any;
  public actionUserStores: any;
  public actionUserBranches: any;

  public action: string = "";
  public branches: any[] = [];
  public stores: any[] = [];
  takefrombalance: number;
  addtobalance: number;
  public asafe: any={id:0, data:{balance:0}};
  public safes: any[] = [];
  constructor(private _hs: HttpService, private _ss: ShareService, private _router: Router, private _ut: UtilsService) {

  }
  safeSelected(){
    this.asafe.data= JSON.parse(this.asafe.data);
  }
  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.loggedInUser = user;
    });
    this._ss.setAppIsBusy(true);
    this._hs.get('lookups', 'filter[]=group,eq,tresuries&filter[]=parent,gt,0&satisfy=all')
      .subscribe(res => {
        this.safes = res.json().lookups;
        this._ss.setAppIsBusy(false);
      });
    // if (this.loggedInUser == null || this.loggedInUser.id == 0 || this.loggedInUser.roles.indexOf('t') < 0) {
    //   this._router.navigateByUrl('/login');
    // }
  }
  setPage(ev) {
    this.page = this.users.slice(ev.pageIndex * ev.pageSize, (ev.pageIndex + 1) * ev.pageSize);
  }
  refreshUsers() {
    this._ss.setAppIsBusy(true);
    if (true || this.loggedInUser && this.loggedInUser.roles.indexOf('t') >= 0) {
      this._hs.get('users').subscribe(res => {
        this.users = res.json().users;
        this.page = this.users.slice(0, 5);
        this._ss.setAppIsBusy(false);
      });
    }
  }
  setBalance(user) {
    this.addtobalance = 0;
    this.takefrombalance = 0;
    this.actionUser = user;
    this.action = "editbalance";
  }
  doSetBalance() {
    let masafe=JSON.parse(JSON.stringify(this.asafe));
    
    if (this.addtobalance < 0) {
      this._ss.setSnackBar('لا يمكن اضافه رقم سالب للرصيد');
      return;
    }
    if (this.takefrombalance < 0) {
      this._ss.setSnackBar('لا يمكن اخذ رقم سالب من الرصيد');
      return;
    }
    if ( Number(this.takefrombalance) ==0 && Number(this.addtobalance)==0) {
      this._ss.setSnackBar('لم تقم بأضاقه رصيد او استلام من رصيد');
      return;
    }
    
    if (this.asafe.id == 0) {
      this._ss.setSnackBar('لم تختر الخزينه بعد');
      return;
    }

    this.actionUser.balance = this.actionUser.balance - this.takefrombalance;
    this.actionUser.balance = this.actionUser.balance + this.addtobalance;

    masafe.data.balance= Number(masafe.data.balance)+this.takefrombalance;
    masafe.data.balance= Number(masafe.data.balance)-this.addtobalance;
    
    this.asafe.data.balance= Number(this.asafe.data.balance)+this.takefrombalance;
    this.asafe.data.balance= Number(this.asafe.data.balance)-this.addtobalance;
    
    masafe.data = JSON.stringify(masafe.data);
    this._ss.setAppIsBusy(true);
    this._hs.put('lookups', 'id',masafe).subscribe(res=>{
      this.takefrombalance=0;
      this.addtobalance=0;
    });
    this.saveUser();
  }
  setBranches(user) {
    this.actionUser = user;
    this.action = "editbranches";
    this.actionUserStores = JSON.parse(this.actionUser.stores);
    this.actionUserBranches = JSON.parse(this.actionUser.branches);
    this._hs.get('lookups', 'filter[]=group,eq,branches').subscribe(res => {
      this.branches = res.json().lookups;
      this.branches = this.branches.filter(obj => obj.parent != 0);
    });
  }
  setStores(user) {
    this._ss.setAppIsBusy(true);
    this.actionUser = user;
    this.action = "editstores";
    this.actionUserStores = JSON.parse(this.actionUser.stores);
    this.actionUserBranches = JSON.parse(this.actionUser.branches);

    this._hs.get('lookups', 'filter[]=group,eq,stores').subscribe(res => {
      this.stores = res.json().lookups;
      this.stores = this.stores.filter(obj => obj.parent != 0);
      this._ss.setAppIsBusy(false);
    });
  }
  saveUser() {
    this._ss.setAppIsBusy(true);
    if (this.actionUser.id > 0) {
      this._hs.put('users', 'id', this.actionUser).subscribe(res => {
        if (res.json() == 1) {
          this._ss.setSnackBar('تم تعديل بيانات المستتخدم');
        }
        this._ss.setAppIsBusy(false);
      });
    } else {
      delete this.actionUser.id;
      this._hs.post('users', this.actionUser).subscribe(res => {
        if (res.json() > 0) {
          this._ss.setSnackBar('تم اضاقه المستتخدم');
        }
        this._ss.setAppIsBusy(false);
      });
    }
  }
  addUser() {
    this.actionUser = {
      id: 0,
      namear: '',
      username: '',
      pwd: 'renewpass' + Math.random(),
      balance: 0,
      roles: '',
      locked: 1,
      phone: ''
    };
    this.action = "adduser";
  }
  edit(user) {
    this.actionUser = user;
    this.action = "edituser";
  }
  role(role) {
    if (this.actionUser.roles.indexOf(role) >= 0) {
      this.actionUser.roles.replace(role + ";", "");
    } else {
      this.actionUser.roles += role + ";";
    }
  }
  deleteSB(one) {
    if (this.action == "editbranches") {
      this.actionUserBranches.splice(this.actionUserBranches.indexOf(one.id), 1);
      this.actionUser.branches = JSON.stringify(this.actionUserBranches);
    }
    else {
      this.actionUserStores.splice(this.actionUserStores.indexOf(one.id), 1);
      this.actionUser.stores = JSON.stringify(this.actionUserStores);
    }
    this._ss.setAppIsBusy(true);
    this._hs.put('users', 'id', this.actionUser).subscribe(res => {
      if (res.json() == 1) {
        if (this.action == "editbranches")
          this.setBranches(this.actionUser)
        else
          this.setStores(this.actionUser)
      }
      this._ss.setAppIsBusy(false);

    });

  }
  addSB(one) {
    this._ss.setAppIsBusy(true);

    if (this.action == "editbranches") {
      this.actionUserBranches.push(one.id);
      this.actionUser.branches = JSON.stringify(this.actionUserBranches);
    }
    else {
      this.actionUserStores.push(one.id);
      this.actionUser.stores = JSON.stringify(this.actionUserStores);
    }
    this._hs.put('users', 'id', this.actionUser).subscribe(res => {
      if (res.json() == 1) {
        if (this.action == "editbranches")
          this.setBranches(this.actionUser)
        else
          this.setStores(this.actionUser)

      }
      this._ss.setAppIsBusy(false);
    });
  }

  delete(user: any) {
    this._ut.messageBox('confirm', 'تحذير حذف مستخدم', 'هل حقا تريد حذف المستخدم [' + user.namear + ']')
      .afterClosed()
      .subscribe(dialog => {
        if (dialog == 'ok') {
          this._ss.setAppIsBusy(true);
          this._hs.delete('users', user.id, user).subscribe(res => {
            if (res.json() == 1) {
              this._ss.setSnackBar("تم حذف المستخدم بنجاح أرجو تحديث المستخدمين لكي يتلاشى من القائمه");
            }
            this._ss.setAppIsBusy(false);
          });

        }
      });
  }
  lock(user) {
    this._ss.setAppIsBusy(true);
    this.actionUser = user;
    this.actionUser.locked = 1;
    this._hs.put('users', 'id', this.actionUser).subscribe(res => {
      if (res.json() == 1) {
      }
      this._ss.setAppIsBusy(false);
    });
  }
  unlock(user) {
    this._ss.setAppIsBusy(true);
    this.actionUser = user;
    this.actionUser.locked = 0;
    this._hs.put('users', 'id', this.actionUser).subscribe(res => {
      if (res.json() == 1) {
      }
      this._ss.setAppIsBusy(false);
    });
  }



}
