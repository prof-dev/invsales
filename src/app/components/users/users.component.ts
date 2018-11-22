import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: any;
  public loggedInUser: any=null;
  public actionUser: any;
  public actionUserStores: any;
  public actionUserBranches: any;

  public action: string = "";
  public branches: any[] = [];
  public stores: any[] = [];
  public deleteMsg: string;
  constructor(private _hs: HttpService, private _ss: ShareService, private _router:Router) { 
    
  }

  ngOnInit() {
    
    this._ss.User.subscribe(user => {
      this.loggedInUser = user;
      if (this.loggedInUser.id==0 && this.loggedInUser.roles.indexOf('admin')<0){
        this._router.navigateByUrl('/login');
      }
    });
    if (this.loggedInUser==null  || this.loggedInUser.id==0 || this.loggedInUser.roles.indexOf('admin')<0){
      this._router.navigateByUrl('/login');
    }
  }
  setBranches(user) {
    this.action = "editbranches";
    this.actionUser = user;
    this.actionUserStores = JSON.parse(this.actionUser.stores);
    this.actionUserBranches = JSON.parse(this.actionUser.branches);
    this._hs.get('lookups', 'filter[]=group,eq,branch').subscribe(res => {
      this.branches = res.json().lookups;
    });
  }
  setStores(user) {
    this.action = "editstores";
    this.actionUser = user;
    this.actionUserStores = JSON.parse(this.actionUser.stores);
    this.actionUserBranches = JSON.parse(this.actionUser.branches);

    this._hs.get('lookups', 'filter[]=group,eq,store').subscribe(res => {
      this.stores = res.json().lookups;
    });
  }
  saveUser() {
    if (this.actionUser.id > 0) {
      this._hs.put('users', 'id', this.actionUser).subscribe(res => {
        if (res.json() == 1) {

        }
      });
    } else {
      delete this.actionUser.id;
      this._hs.post('users', this.actionUser).subscribe(res => {
        console.log('adding result: ', res.json());
        
      });
    }
  }
  addUser() {
    this.action = "adduser";
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


  }
  edit(user) {
    this.action = "edituser";
    this.actionUser = user;
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
    this._hs.put('users', 'id', this.actionUser).subscribe(res => {
      if (res.json() == 1) {
        if (this.action == "editbranches")
          this.setBranches(this.actionUser)
        else
          this.setStores(this.actionUser)
      }
    });

  }
  addSB(one) {
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
    });
  }




  delete(user) {
    this.action = "deleteuser";
    this.actionUser = user;
    this.deleteMsg = "";
  }
  deleteUser() {
    this._hs.delete('users', this.actionUser.id).subscribe(res => {
      if (res.json() == 1) {
        this.deleteMsg = "User is deleted successfylly, please refresh users.";
      }
    });
  }
  lock(user) {
    this.action = "lockuser";
    this.actionUser = user;
    this.actionUser.locked = 1;
    this._hs.put('users', 'id', this.actionUser).subscribe(res => {
      if (res.json() == 1) {

      }
    });
  }
  unlock(user) {
    this.action = "unlockuser";
    this.actionUser = user;
    this.actionUser.locked = 0;
    this._hs.put('users', 'id', this.actionUser).subscribe(res => {
      if (res.json() == 1) {

      }
    });
  }




  refreshUsers() {
    if (this.loggedInUser && this.loggedInUser.roles.indexOf('admin') >= 0) {
      this._hs.get('users').subscribe(res => {
        this.users = res.json().users;
      });
    }
  }

}
