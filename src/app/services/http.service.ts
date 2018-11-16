import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public APISERVER:string = '';
  public APIURL:string = '';
  public HOST: string = '';

  constructor(public _http: Http) {
    this.doenv();
  }
  doenv() {
    if (environment.production) {
      this.APISERVER = 'http://localhost:83/invsales/';
    }else{
      this.APISERVER = 'http://localhost:83/invsales/';
    }
    this.HOST=this.APISERVER+'api.php/';
  }
  post(table, data) {
    return this._http.post(this.HOST + table, data);
  }
  get(table, where?) {
    return this._http.get(this.HOST + table + "?transform=1&" + where);
  }
  put(table, int_auto_primarykey_field, body) {
    return this._http.put(this.HOST + table + '/' + body[int_auto_primarykey_field], body);
  }
 
  delete(table, id) {
    return this._http.delete(this.HOST + table + '/' + id);
  }
  
  sendeMail(email: string, apikey: string, password: string, username: string) {
    return this._http.get(this.APISERVER + "mail.php?type=send&password=" + password + "&username=" + username + "&email=" + email + "&apikey=" + apikey);
  }
  sendResetePasswordMail(email: string, resetPasswordCode: string) {
    return this._http.get(this.APISERVER + "mail.php?type=resetpassword&email="+email+"&resetcode=" + resetPasswordCode);
  }
}
