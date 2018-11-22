import { Component, OnInit, Inject } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';




interface Data {
    phone: string;
    phone2: string;
    whatsapp: string;
    email: string;
}
interface Suppcus {
    id: number;
    type: string;
    fullname: string;
    data: any;
    balance: number;
}



@Component({
    selector: 'app-suppcus',
    templateUrl: './suppcus.component.html',
    styleUrls: ['./suppcus.component.css']
})
export class SuppcusComponent implements OnInit {

    public suppcus: Suppcus[] = [];
    public theader: any = [];
    public data: Data;
    public formtype: string;
    public user: any;

    public form: any;


    message: string;

    constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router) { }
    ngOnInit() {
        this.form = {
            "type": "",
            "id": 0,
            "balance": 0.00,
            "fullname": "",
            "data": {
                "phone": "",
                "whatsapp": "",
                "email": "",
                "phone2": ""
                // "location" "4555,55555"
            }
        }
        this._ss.User.subscribe(user => {
            this.user = user;
            if (this.user.id == 0) {
                this._router.navigateByUrl('/login');
            }
        });

    }


    save(form) {
        if (form.fullname != "") {
            form.data = JSON.stringify(form.data);
            console.log(form.data);
            this._hs.post('suppcus', form).subscribe(res => {

                this.message ='تم حفظ  '+ this.formtype+' بنجاح';

            })
            this.ngOnInit();
        }
        else {
            this.message = 'الرجاء ملء جميع الحقول';
        }
    }


    setType(type) {

        this.form.type = type;

        if (this.form.type == 's') {
            this.formtype = ' الموردين';


            this._hs.get('suppcus', 'filter=type,eq,s')
                .subscribe(res => {
                    this.suppcus = res.json().suppcus;
                    this.suppcus .forEach(element => {
                        element.data=JSON.parse(element.data);
                    });
                })

        }
        else if (this.form.type == 'c') {
            this.formtype = 'العملاء';
            this._hs.get('suppcus', 'filter=type,eq,c')
            .subscribe(res => {
                this.suppcus = res.json().suppcus;
                this.suppcus .forEach(element => {
                    element.data=JSON.parse(element.data);
                    console.log(element.data);
                    

                });

            })
        }
    }
    onNoClick() {
        this.ngOnInit();
    }
}


