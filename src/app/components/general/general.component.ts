import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  constructor(
    // public dialogRef: MatDialogRef<DialogsComponent>,
    // @Inject(MAT_DIALOG_DATA)
    // public data: DialogData,
    // public _hs: HttpService,
    // public _ss: ShareService
    ) {


  }


  ngOnInit() {
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      } else {



      }
    });
  }

  // print(printSectionId) {
  //   var innerContents = document.getElementById(printSectionId).innerHTML;
  //   var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
  //   popupWinindow.document.open();
  //   popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + innerContents + '</html>');
  //   popupWinindow.document.close();

  // }

  

}


// export class DialogData {
//   public reportname: string;
//   public message: string;
//   public submessage: string;
//   public result: any;
//   public placeholder: string;
//   constructor() {
//     this.type = '';
//     this.message = '';
//     this.submessage = '';
//     this.result = '';
//     this.placeholder = '';
//   }
}
