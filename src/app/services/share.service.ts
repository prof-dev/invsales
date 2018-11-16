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
  private user = new BehaviorSubject({});
  public User = this.user.asObservable();
  setUser(user) {
    this.user.next(user);
  }
  //End User

}
