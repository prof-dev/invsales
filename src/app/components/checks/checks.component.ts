import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-checks',
  templateUrl: './checks.component.html',
  styleUrls: ['./checks.component.css']
})
export class ChecksComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = [];
  public filteredOptions: Observable<string[]>;
  public user: any;
  public checks: any[] = [];
  public recordStatus: string;



  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }
  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  ngOnInit() {

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      } else {
        this._hs.get('checks')
          .subscribe(res => {
            console.log(res.json());

            this.checks = res.json().checks;
            console.log(this.checks);
            this.checks.forEach(ch => {
              this.statuses.forEach(element => {
                if (ch.status==element.value){
                  ch.status= element.viewValue;
                }
              });
            });


          })
      }
    });
  }

     public statuses: Choice[] = [
    { value: 'returned', viewValue: 'مرتد'},
    { value: 'partially', viewValue: 'سداد جزئي'},
    { value: 'resolved', viewValue: 'تسوية'},
    { value: 'law', viewValue: 'الشؤون القانونية'},
    { value: 'payed', viewValue:'تم السداد' }]

    public sources:Choice[]=[
      { value: '0', viewValue: 'وارد'},
      { value: '1', viewValue: 'صادر'}

    ]

    getarabic(status){
      confirm(status);
      this.recordStatus="";
      this.statuses.forEach(element => {
        if (status==element.value){
          this.recordStatus= element.viewValue;
        }
      });
    }

    update(check){

    }


}


interface Choice {
  value: string;
  viewValue: string;
}



