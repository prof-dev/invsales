import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, DialogsComponent } from '../components/dialogs/dialogs.component';
import { MatSnackBar } from '@angular/material';
import { ShareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  public thedata: DialogData
  private dialogRef: any;
  private user: any={};
  public REPORTHEADER='<!doctype html><html lang="ar"><head><title>Prining</title><style>'+
  'table {font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;}'+
  'table td, table th {border: 1px solid #ddd;}table td{height: 30px;padding-right: 5px;}table '+
  'tr:nth-child(even){background-color: #f2f2f2;}table tr:hover {background-color: #ddd;}table'+
  ' th {padding-top: 5px;padding-bottom: 5px;padding-right: 5px;text-align: right;background-color: blue;color: white;}table mat-form-field{width:80px;}</style>'+
  '</head><body dir="rtl"><br><br><br><table><tr><td><b>الخرطوم السجانة</b><br><b>0123111000</b><br>'+
  '<b>Awadallah</b></td>'+
  '<td><h1>شركة هيفن</h1></td><td><img src="data:image/jpeg;base64,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"'+
  '></td></tr></table><br><br>';
  public REPORTFOOTER='<br><br><b>التوقيع</b>:<br>----------------------------<br><b>اصدرت بواسطه</b>: '+ this.user.fullname +'<br><b>ملحوظات</b>:</body></html>';

  constructor(private dialog: MatDialog, private _ss:ShareService) {
    this.thedata = new DialogData();
    this._ss.User.subscribe(user=>{
      this.user = user;
      this.REPORTFOOTER='<br><br><b>:التوقيع</b><br>----------------------------<br><b>:اصدرت بواسطه</b> '+ this.user.fullname +'<br><b>:ملحوظات</b></body></html>';
    });
  }
  public generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  public messageBox(type, message, submessage, placeholder?): any {
    this.thedata = new DialogData();
    this.thedata.type = type;
    this.thedata.message = message;
    this.thedata.submessage = submessage;
    this.thedata.placeholder = placeholder;

    return this.dialog.open(DialogsComponent, {
      width: this.thedata.type === 'getsupplier'? '600px' : '300px',
      data: this.thedata
    });
  }

  showReport(title:string, divid:string){
    var w = window.open();
    
    w.document.write(this.REPORTHEADER+'<h3>'+title+'</h3>');
    w.document.write(document.getElementById(divid).innerHTML);
    w.document.write(this.REPORTFOOTER);
    w.document.close();
    w.print();
    w.close();
  }

}
export class FlowMessaging {
  message: string;
  color: string;
  public snackBar: MatSnackBar;
  constructor(message: string, color: string) {
    this.message = message;
    this.color = color;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  
}
