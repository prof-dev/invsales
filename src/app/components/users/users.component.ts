import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { UtilsService } from "../../services/utils.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: any;
  public loggedInUser: any = null;
  public actionUser: any;
  public actionUserStores: any;
  public actionUserBranches: any;

  public action: string = "";
  public branches: any[] = [];
  public stores: any[] = [];
  constructor(private _hs: HttpService, private _ss: ShareService, private _router: Router, private _ut: UtilsService) {

  }

  ngOnInit() {

    this._ss.User.subscribe(user => {
      this.loggedInUser = user;
    });
    if (this.loggedInUser == null || this.loggedInUser.id == 0 || this.loggedInUser.roles.indexOf('t') < 0) {
      this._router.navigateByUrl('/login');
    }
  }
  setBranches(user) {
    this.actionUser = user;
    this.action = "editbranches";
    this.actionUserStores = JSON.parse(this.actionUser.stores);
    this.actionUserBranches = JSON.parse(this.actionUser.branches);
    this._hs.get('lookups', 'filter[]=group,eq,branch').subscribe(res => {
      this.branches = res.json().lookups;
    });
  }
  setStores(user) {
    this._ss.setAppIsBusy(true);
    this.actionUser = user;
    this.action = "editstores";
    this.actionUserStores = JSON.parse(this.actionUser.stores);
    this.actionUserBranches = JSON.parse(this.actionUser.branches);

    this._hs.get('lookups', 'filter[]=group,eq,store').subscribe(res => {
      this.stores = res.json().lookups;
      this._ss.setAppIsBusy(false);
    });
  }
  saveUser() {
    this._ss.setAppIsBusy(true);

    if (this.actionUser.id > 0) {
      this._hs.put('users', 'id', this.actionUser).subscribe(res => {
        if (res.json() == 1) {

        }
        this._ss.setAppIsBusy(false);
      });
    } else {
      delete this.actionUser.id;
      this._hs.post('users', this.actionUser).subscribe(res => {
        this._ss.setAppIsBusy(false);
      });
    }
  }
  addUser() {
    this.actionUser = {
      id: 0,
      fullname: '',
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

  delete(user:any) {
    this._ut.messageBox('confirm', 'تحذير حذف مستخدم', 'هل حقا تريد حذف المستخدم [' + user.fullname + ']')
      .afterClosed()
      .subscribe(dialog => {
        if (dialog == 'ok') {
          this._ss.setAppIsBusy(true);
          this._hs.delete('users', user.id).subscribe(res => {
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

  refreshUsers() {
    this._ss.setAppIsBusy(true);
    if (this.loggedInUser && this.loggedInUser.roles.indexOf('t') >= 0) {
      this._hs.get('users').subscribe(res => {
        this.users = res.json().users;
        this._ss.setAppIsBusy(false);

      });
    }
  }

}
