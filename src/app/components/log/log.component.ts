import { Component, OnInit , ViewChild} from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ShareService } from 'src/app/services/share.service';
import { MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {
  public logs: any[];
  public log: any;
  public username:string;
  @ViewChild('fromdate')
  public fromdate:any;
  public todate:any;

  constructor(private _hs: HttpService, private _ut: UtilsService, private _ss: ShareService) { }

  ngOnInit() {
    this._hs.get('log').subscribe(res => { this.logs = res.json().log });
  }

  details(log) {
    if (this.log == log)
      return;
    this.log = log;
    this.log.body = JSON.parse(this.log.body);
    this.log.row = [];
    for (var k in this.log.body) {
      this.log.row.push({ name: k, value: this.log.body[k] })
    }
  }
  
  refresh() {
    console.log('from date: ', Date.parse(this.fromdate._selectedDate) );
  }
}
