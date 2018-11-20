import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { element } from '@angular/core/src/render3/instructions';
import { Check } from 'src/app/classes/Lookup';
import { toDate } from '@angular/common/src/i18n/format_date';

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
  public i: number;
  public checkes: Check[] = [];
  public check: Check;
 
  
  


  public sourceese: Choice[] = [
    { value: 'in', viewValue: 'وارد' },
    { value: 'out', viewValue: 'صادر' }

  ]
 public checkmodify: Check;

  

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


            this.checks.forEach(check => {
              this.check = check;
              this.statuses.forEach(element => {
                if (check.status == element.value) {

                  this.check.status = element.viewValue;

                }
              })
              this.sourceese.forEach(element => {
                if (check.source == element.value) {
                  this.check.source = element.viewValue;
                }

              })
              this.checkes.push(this.check);
            });



          });
      }
    });


    
    
  }
  

  public statuses: Choice[] = [
    { value: 'returned', viewValue: 'مرتد' },
    { value: 'partially', viewValue: 'سداد جزئي' },
    { value: 'resolved', viewValue: 'تسوية' },
    { value: 'law', viewValue: 'الشؤون القانونية' },
    { value: 'payed', viewValue: 'تم السداد' }]



  update(check) {

  }

  


}


interface Choice {
  value: string;
  viewValue: string;
}

interface Choice2 {
  value: number;
  viewValue: string;
}




