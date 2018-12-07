import { Component, OnInit, Inject } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
declare var ol: any;
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
    map: any;
    public suppcus: Suppcus[] = [];
    public theader: any = [];
    public data: Data;
    public formtype: string;
    public user: any;

    public form: any;

    public operation = 0;
    location: any;
    temp: any;

    constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router) { }
    ngOnInit() {
        
        this.map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),

            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([32.546012, 15.51056]),
                zoom: 14
            })
        });
        this.map.on('singleclick', (ev)=>{
            this.location = ol.proj.toLonLat(ev.coordinate);
            this.temp=this.location[0];
            this.location[0]=this.location[1];
            this.location[1]=this.temp;
            console.log('location: ', ev.coordinate)
        });
        this.operation = 0;
        this._ss.User.subscribe(user => {
            this.user = user;
            if (this.user.id == 0) {
                this._router.navigateByUrl('/login');
            } else {
                this.resetForm();
            }
        });


    }

    resetForm() {
        this.form = {
            "type": "",
            "id": 0,
            "balance": 0.00,
            "fullname": "",
            "branch": "",
            "data": {
                "phone": "",
                "whatsapp": "",
                "email": "",
                "phone2": "",
                 "location":null
            }
        }
    }
    save(form) {
        this.form.data.location=this.location;
        if (form.id != 0 && form.phone!="" && form.whatsapp!=""&& form.fullname!="") {
            form.data = JSON.stringify(form.data);
            console.log(form.data);
            this._hs.put('suppcus', "id", form).subscribe(res => {
                this._ss.setSnackBar('تم حفظ  ' + this.formtype + ' بنجاح');
            });
            this.resetForm();

        }
        else
            if (form.fullname != "") {
                form.data = JSON.stringify(form.data);
                console.log(form.data);
                this._hs.post('suppcus', form).subscribe(res => {
                    this._ss.setSnackBar('تم حفظ  ' + this.formtype + ' بنجاح');
                });
                this.resetForm();
            }
            else {
                this._ss.setSnackBar('الرجاء ملء جميع الحقول');
            }
    }


    setType(type) {
        this.ngOnInit();
        this.operation = 1;
        this.form.type = type;

        if (this.form.type == 's') {
            this.formtype = ' الموردين';


            this._hs.get('suppcus', 'filter=type,eq,s')
                .subscribe(res => {
                    this.suppcus = res.json().suppcus;
                    this.suppcus.forEach(element => {
                        element.data = JSON.parse(element.data);
                    });
                })

        }
        else if (this.form.type == 'c') {
            this.formtype = 'العملاء';
            this._hs.get('suppcus', 'filter=type,eq,c')
                .subscribe(res => {
                    this.suppcus = res.json().suppcus;
                    this.suppcus.forEach(element => {
                        element.data = JSON.parse(element.data);
                        console.log(element.data);
                    });
                })
        }
    }
    onNoClick() {
        this.resetForm();
    }


    modify(item) {
        this.operation = 2;
        if (item.type == 's') {
            this.formtype = 'تعديل الموردين';

        }
        else if (item.type == 'c') {
            this.formtype = 'تعديل العملاء';

        }

        this.form = item;
        //   this.form.data=JSON.parse(item.data);

    }
}


