import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  public logs: any[];
  public log: any;
  constructor(private _hs: HttpService, private _ut: UtilsService, private _ss: ShareService) { }

  ngOnInit() {
    this._hs.get('log').subscribe(res => { this.logs = res.json().log });
  }

  details(log) {
    this.log=log;
  }
}
