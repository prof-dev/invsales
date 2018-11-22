import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, DialogsComponent } from '../components/dialogs/dialogs.component';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  public thedata: DialogData
  private dialogRef: any;
  private user: any;

  constructor(private dialog: MatDialog) {
    this.thedata = new DialogData();
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
