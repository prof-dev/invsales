import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
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
    namear: string;
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
    @ViewChild('date')
    public date: any;
    public theader: any = [];
    public data: Data;
    public formtype: string;
    public user: any;
    public processinfo = {
        operation: 0,
        disbalance: true
    }
    public supcus: any;

    public operation = 0;
    location: any;
    temp: any;
    public paid = 0;
    public sadad: any = {};
    public payment: any;
    public payments: any[] = [];
    public check = {
        id: 0,
        checkno: "",
        bankname: "",
        date: "",
        status: "",
        checkowner: "0",
        lastholder: "",
        amount: 4,
        source: "",
        user: 0,
        comment: "",
        invoice: 0
    };

    constructor(private _ss: ShareService, private _hs: HttpService, private _router: Router, private _ut: UtilsService) { }
    ngOnInit() {
        this.payment = {
            paymentmethod: "",
            amount: 0.0,
            paymenttype: 5,
            checkNo: "0000",
            amountUSD: 0.00,
            rate: 0.00,
            date: ""
        };

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
        this.map.on('singleclick', (ev) => {
            this.location = ol.proj.toLonLat(ev.coordinate);
            this.temp = this.location[0];
            this.location[0] = this.location[1];
            this.location[1] = this.temp;
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
        this.supcus = {
            "type": "",
            "id": 0,
            "balance": 0.00,
            "namear": "",

            "data": {
                "phone": "",
                "whatsapp": "",
                "email": "",
                "phone2": "",
                "location": null,
                "branch": "",
                "transport": "",
                "class": "",
                "transphone": "",
                "purname": "",
                "purhpone": "",
                "domain": "",
                "purwhats": ""
            }
        }
    }
    save(form) {
        this.supcus.data.location = this.location;
        console.log(this.supcus);
        
        if (this.supcus.id !=0 && this.supcus.phone != "" && this.supcus.whatsapp != "" && this.supcus.namear != "") {
            this.supcus.data = JSON.stringify(this.supcus.data);
            console.log(this.supcus.data);
            this._hs.put('suppcus', "id", this.supcus).subscribe(res => {
                this._ss.setSnackBar('تم حفظ  ' + this.formtype + ' بنجاح');

            });

        }
        else
            if (this.supcus.namear != "") {
                this.supcus.data = JSON.stringify(this.supcus.data);
                console.log(this.supcus.data);
                this._hs.post('suppcus', this.supcus).subscribe(res => {
                    this._ss.setSnackBar('تم حفظ  ' + this.formtype + ' بنجاح');

                });
            }
            else {
                this._ss.setSnackBar('الرجاء ملء جميع الحقول');
            }

        if (this.supcus.type == 's') {
            this.formtype = ' الموردين';
            this.getSubCus('s');
        }
        else if (this.supcus.type == 'c') {
            this.formtype = 'العملاء';
            this.getSubCus('c');
        }
        this.resetForm();

    }


    setType(type) {
        // this.ngOnInit();
        this.operation = 1;
        this.supcus.type = type;
        this.processinfo.disbalance = false;

        if (this.supcus.type == 's') {
            this.formtype = ' الموردين';
            this.getSubCus('s');
        }
        else if (this.supcus.type == 'c') {
            this.formtype = 'العملاء';
            this.getSubCus('c');
        }
    }
    private getSubCus(type) {
        this._hs.get('suppcus', 'filter=type,eq,' + type)
            .subscribe(res => {
                this.suppcus = res.json().suppcus;
                this.suppcus.forEach(element => {
                    element.data = JSON.parse(element.data);
                    console.log(element.data);
                });
            });
    }

    onNoClick() {
        this.resetForm();
    }

    pay(row) {
        this.modify(row);
        this.processinfo.operation = 1;
    }

    modify(item) {
        this.processinfo.disbalance = true;
        this.operation = 2;
        if (item.type == 's') {
            this.formtype = 'تعديل الموردين';

        }
        else if (item.type == 'c') {
            this.formtype = 'تعديل العملاء';

        }

        this.supcus = item;
        //   this.supcus.data=JSON.parse(item.data);

    }

    pushpayment(payment) {
        this.paid = 0;
        if (payment.amount > 0) {
            this.payments.push(payment);
            this.payments.forEach(element => {
                this.paid = this.paid + Number(element.amount);
                console.log(element.amount);

                console.log("المدفووووووووووع :", this.paid);
                this.payment = {};
            });
        }
        else {
            this._ss.setSnackBar("الرجاء ملء بيانات الدفع");
        }



    }
    savePayment() {
        if (this.supcus.id != null && this.sadad.desc != "" && this.payments.length > 0) {
            this.sadad.suppcusid = this.supcus.id;
            this.sadad.data = JSON.stringify(this.payments);
            if (this.supcus.type == 'c') {

                this.supcus.amount = Number(this.supcus.amount) + Number(this.paid);
                this.sadad.newbalance=Number(this.supcus.amount) + Number(this.paid);
            }
            else {
                this.supcus.amount = Number(this.supcus.amount) - Number(this.paid);
                this.sadad.newbalance= Number(this.supcus.amount) - Number(this.paid);
            }
            this.sadad.oldbalance=this.supcus.amount;
            
            this.sadad.usersid = this.user.id;
            this.sadad.amount = this.paid;
            this._hs.post('sadad', this.sadad).subscribe(res => {
                this.sadad.id = res.text();
                this.updatesuppcussbalance();
                this.insertchecks();
                this._ss.setSnackBar('تم حفظ الدفعية بنجاح');
            });

        }
        else {
            this._ss.setSnackBar('الرجاء تعبئة الحقول الأساسية');

        }
    }

    private insertchecks() {

        this.payments.forEach(element => {
            if (element.paymentmethod == "check") {
                if (element.bankname != "" && element.checkNo != "" && element.amount != 0) {
                    this.check.user = this.user.id;
                    this.check.bankname = element.bankname;
                    this.check.checkowner = element.checkowner;
                    this.check.amount = element.amount;
                    this.check.checkno = element.checkno;
                    console.log(element.date);

                    this.check.date = (new Date(element.date)).toISOString().split('T')[0];
                    if (this.supcus.type == 'c') {
                        this.check.source = "in";

                    }
                    else {
                        this.check.source = "out";
                    }
                    this.check.status = element.checkstatus;
                    this.check.status = element.checkstatus;
                    console.log(this.check);
                    this._hs.post('checks', this.check).subscribe(res2 => {
                        this._ss.setSnackBar("تم حفظ الشيك");
                    });
                }
            }
            this.check = {
                id: 0,
                checkno: "",
                bankname: "",
                date: "",
                status: "",
                checkowner: "0",
                lastholder: "",
                amount: 4.00,
                source: "",
                user: 0,
                comment: "",
                invoice: 0
            };
        });
    }

    updatesuppcussbalance() {
     
        this.supcus.data = JSON.stringify(this.supcus.data);
        this._hs.put('suppcus', "id", this.supcus).subscribe(res => {
            this._ss.setSnackBar("تم تعديل رصيد العميل");
        }
        );
    }
    print() {
        this._hs.log('user1', 'tbl1', 'c', 'screen x', 'so and so');
        this._ut.showReport('إيصال إستلام');
    }
    public paymentmethods: Choice[] = [
        { value: 'check', viewValue: 'شيك' },
        { value: 'cash', viewValue: 'كاش' }
    ];
    public checkstatus: Choice[] = [
        { value: 'clarified', viewValue: 'مظهر' },
        { value: 'new', viewValue: 'جديد' }
    ];
}

interface Choice {
    value: string;
    viewValue: string;
}



