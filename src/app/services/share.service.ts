import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(private _hs: HttpService) {

  }

  //User
  private user = new BehaviorSubject({ id: 0 });

  public User = this.user.asObservable();
  setUser(user) {
    this._hs.currentUser=user.username;
    this.user.next(user);
  }

  //SnackBar
  private snackBar = new BehaviorSubject({});
  public SnackBar = this.snackBar.asObservable();
  setSnackBar(message) {
    this.snackBar.next(message);
  }

  //appIsBusy
  private appIsBusy = new BehaviorSubject({});
  public AppIsBusy = this.appIsBusy.asObservable();
  setAppIsBusy(value) {
    this.appIsBusy.next(value);
  }
}
