import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService, ReportObject } from 'src/app/services/utils.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public report: ReportObject;

  constructor(private _rt: Router, private _ar: ActivatedRoute, private _hs: HttpService, private _ut: UtilsService) 
  { 
    this._ar.params.subscribe(p => {
      this.report = new ReportObject(p.table, this._hs, this._ut);
    });
  }

  ngOnInit() {
   
  }
}
