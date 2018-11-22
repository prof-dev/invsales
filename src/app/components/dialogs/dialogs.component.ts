import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-dialogs',
  templateUrl: './dialogs.component.html',
  styleUrls: ['./dialogs.component.css']
})
export class DialogsComponent implements OnInit {
  public user: any;

  constructor(
    public dialogRef: MatDialogRef<DialogsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    public _hs: HttpService,
    public _ss: ShareService) {


  }

  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
      switch (this.data.type) {
        case 'dfdfdfd':
          this.data.result = ['', ''];
        default:
          break;
      }
    });
  }
  cancel(): void {
    this.dialogRef.close('cancel');
  }
  ok(): void {
    this.dialogRef.close('ok');
  }
}
export class DialogData {
  public type: string;
  public message: string;
  public submessage: string;
  public result: any;
  public placeholder: string;
  constructor() {
    this.type = '';
    this.message = '';
    this.submessage = '';
    this.result = '';
    this.placeholder = '';
  }
}


