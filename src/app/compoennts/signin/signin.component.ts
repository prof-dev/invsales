import { Component, OnInit, Input } from '@angular/core';
import { Headers, RequestOptions,Http } from '@angular/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {
  @Input() message:any;

  constructor(private _http: Http, private _router: Router) { }

  signin(username,password)
  {
         let loginurl = `http://localhost:8082/token`;
         let body = "username=" + username + "&password=" + password + "&grant_type=password";
         let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
         let options = new RequestOptions({ headers: headers });      
         this._http.post(loginurl, body, options).toPromise().then(response => {
                localStorage.setItem('access_token', response.json().access_token);
                localStorage.setItem('expires_in', response.json().expires_in);
                localStorage.setItem('token_type', response.json().token_type);
                localStorage.setItem('userName', response.json().userName);
                this._router.navigate(['salesorder']);
                }).catch(err => { this.errorMessage(err["status"]); Promise.reject(err);});
                  
        return false;
   }  
   
   private errorMessage(status: any): void {
      if ( status > 200) {
        this.message = "Invalid Username/Password";        
      }      
   }
    
  ngOnInit() {
  }
}