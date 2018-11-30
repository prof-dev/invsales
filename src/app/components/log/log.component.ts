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
  public username:string='';
  @ViewChild('fromdate')
  public fromdate:any;
  @ViewChild('todate')
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
    console.log(this.log.body);
    
    this.log.row = [];
    for (var k in this.log.body) {
      this.log.row.push({ name: k, value: this.log.body[k] })
    }
  }
  
  refresh() {
    var from=(new Date(this.fromdate._selected)).toISOString().split('T')[0];
    var to=(new Date(this.todate._selected)).toISOString().split('T')[0];
    var where ='';
    if (from.length>0 && to.length>0){
      where+='filter[]=date,bt,'+from+','+to+'&'
    }
    if (this.username.length>0){
      where+='filter[]=user,eq,'+this.username+'&'
    }
    this._hs.get('log',where).subscribe(res => { this.logs = res.json().log });

  }
}
