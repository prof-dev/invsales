import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('panel', { read: ElementRef }) public panel: ElementRef<any>;

  myControl = new FormControl();
  options: string[] = [];
  public filteredOptions: Observable<string[]>;
  public user: any;
  public checks: any[] = [];
  public recordStatus: string;
  public i: number;
  public checkes: any[] = [];
  public check = {
    id: 0,
    checkno: "",
    bank: "",
    date: "",
    status: "",
    checkowner: "0",
    lastholder: "",
    amount: 4,
    source: "",
    user: 0,
    comment: ""
  }





  public sourceese: Choice[] = [
    { value: 'in', viewValue: 'وارد' },
    { value: 'out', viewValue: 'صادر' }

  ]




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
    { value: 'clarified', viewValue: 'مظهر' },
    { value: 'returned', viewValue: 'مرتد' },
    { value: 'partially', viewValue: 'سداد جزئي' },
    { value: 'resolved', viewValue: 'تسوية' },
    { value: 'law', viewValue: 'الشؤون القانونية' },
    { value: 'payed', viewValue: 'تم السداد' }]



  update(check) {
    this.check = check;
  }

  save(check) {
    check.user=this.user.id;
    
    if (check.id != 0) {
      this._hs.put('checks', "id", check).subscribe(res => {

        // _ss.setSnackBar('تم حفظ  ' + this.formtype + ' بنجاح');

        console.log('تم حفظ  ' + check.checkno + ' بنجاح');
        this._ss.setSnackBar('تم حفظ  ' + check.checkno + ' بنجاح');



      });
    }
    else {
      console.log(check.data);
      this._hs.post('checks', check).subscribe(res => {

        this._ss.setSnackBar('تم حفظ  ' +  check.checkno + ' بنجاح');
        console.log('تم حفظ  ' + check.checkno + ' بنجاح');


      });
    }
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




