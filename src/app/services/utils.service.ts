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
  '<td><h1>شركة هيفن</h1></td><td><img src="http://haven.mohamedosmanelsayed.com/assets/logo.jpg"></td></tr></table><br><br>';
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
