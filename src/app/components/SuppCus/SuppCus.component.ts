import { Component, OnInit, Inject } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InvoiceComponent } from '../invoice/invoice.component';




interface Data {
    name: string;
    address: string;
    balance: number;
}
interface Lookup {
    id: number;
    parent: number;
    isleaf: number;
    data: Data;
    group: string;
}



@Component({
    selector: 'app-suppcus',
    templateUrl: './suppcus.component.html',
    styleUrls: ['./suppcus.component.css']
})
export class SuppcusComponent implements OnInit {

    public lookup: Lookup[] = [];
    public theader: any = [];
    public data: any = {};
    public formtype: string;

    public form = {
        "type": "",
        "id": 0,
        "balance": 0.00,
        "fullname": "",
        "details": {
            "phone": "",
            "whatsapp": "",
            "email": "",
            "phone2": "",
            "location": "4555,55555"
        }
    }
    message: string;

    constructor(private _ss: ShareService, private _hs: HttpService, public dialogRef: MatDialogRef<InvoiceComponent>,
        @Inject(MAT_DIALOG_DATA) public recdata: DialogData) { }
    ngOnInit() {
        if (this.recdata.type == 'sup') {
            this.formtype = 'العملاء';
        }
        else if (this.recdata.type == 'cus') {
            this.formtype = 'الموردين';
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

    save(supcus) {
        if (supcus.fullname != "") {
            supcus.data = JSON.stringify(supcus.data);
            this._hs.post('suppcus', supcus).subscribe(res => {

                console.log("تمت إضافة " + supcus.fullname + " id :" + res);

                this.dialogRef.close();
            })
        }
        else {
            this.message = 'الرجاء ملء جميع الحقول';
        }
    }
}


export interface DialogData {
    type: string;
    id: number;
}