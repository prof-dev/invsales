import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public APISERVER:string = '';
  public HOST: string = '';
  public currentUser:string;
  public currentScreen:string;
  constructor(public _http: Http) {
    this.doenv();
  }
  doenv() {
    if (environment.production) {
      this.APISERVER = 'http://www.prof-dev.com/';
    }else{
      this.APISERVER = 'http://localhost/invsales/';
    }
    this.HOST=this.APISERVER+'api.php/';
  }
  post(table, data) {
    this._http.post(this.HOST+'log',{user:this.currentUser,table:table,cud:'c',screen:this.currentScreen,body: JSON.stringify(data)}).subscribe(res=>{
    });
    return this._http.post(this.HOST + table, data);
  }
  get(table, where?) {
    return this._http.get(this.HOST + table + "?transform=1&" + where);
  }
  put(table, int_auto_primarykey_field, body) {
    this._http.post(this.HOST+'log',{user:this.currentUser,table:table,cud:'u',screen:this.currentScreen,body: JSON.stringify(body)}).subscribe(res=>{
    });
    return this._http.put(this.HOST + table + '/' + body[int_auto_primarykey_field], body);
  }
 
  delete(table, id) {
    this._http.post(this.HOST+'log',{user:this.currentUser,table:table,cud:'d',screen:this.currentScreen,body: id}).subscribe(res=>{
    });
    return this._http.delete(this.HOST + table + '/' + id);
  }
  log(user, table, cud,screen, body){
    this.post('log', {user:user, table:table, cud:cud,screen:screen, body:body}).subscribe(res=>{});
  }
  sendeMail(email: string, apikey: string, password: string, username: string) {
    return this._http.get(this.APISERVER + "mail.php?type=send&password=" + password + "&username=" + username + "&email=" + email + "&apikey=" + apikey);
  }
  sendResetePasswordMail(email: string, resetPasswordCode: string) {
    return this._http.get(this.APISERVER + "mail.php?type=resetpassword&email="+email+"&resetcode=" + resetPasswordCode);
  }
}
