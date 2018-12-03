import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  public report: ReportObject;

  constructor(private _rt: Router, private _ar: ActivatedRoute, private _hs: HttpService, private _ut:UtilsService) { }

  ngOnInit() {
    this._ar.params.subscribe(p => {
      this.report = new ReportObject(p.table, this._hs);
    });
  }
}
export interface SearchFeild {
  type: string;
  placeholder: string;
  fieldname: string;
  operator: string;
  value: any
}
export interface AggregationField {
  fieldname?: string; // field name in the table
  value?: number; // field name in the table
  groupas: string; //'sum' or 'count'
  title: string;
}
export class ReportObject {

  public table: string;
  public items: any[];
  public itemfields: string[];
  public aggrefields: AggregationField[];
  public searchfields: SearchFeild[];
  public title: string;
  public ready: number;
  
  constructor(table: string, private _hs: HttpService) {
    this.ready = 0;
    this.table = table;
    this.searchfields = [];
    this.aggrefields = [];
    this._hs.getFieldsNames(this.table).subscribe(res => {
      this.itemfields = res.json()[this.table].columns;
      this.itemfields.splice(this.itemfields.indexOf('data'), 1);
      ++this.ready;
    });
    this._hs.get(this.table).subscribe(res => {
      this.items = res.json()[this.table];
      ++this.ready;
      return this.items;
    });
    switch (this.table) {
      case 'pursales':
        this.title = 'تقرير المبيعات والمشتروات';
        this.searchfields.push({ type: 'string', fieldname: 'type', operator: 'eq', placeholder: 'نوع المعامله', value: 's' });
        this.searchfields.push({ type: 'number', fieldname: 'entityid', operator: 'gt', placeholder: 'رقم العميل اكبر من', value: '0' });
        this.aggrefields.push({ fieldname: 'totalprice', groupas: 'sum', title: 'مجموع الرصيد' });
        this.aggrefields.push({ groupas: 'count', title: 'عدد المعاملات' });
        ++this.ready;
        break;
      default:
        break;
    }
  }

  search() {
    console.log('search fields: ', this.searchfields);
    var where = '';
    this.searchfields.forEach(field => {
      if (field.value.length > 0)
        where += 'filter[]=' + field.fieldname + ',' + field.operator + ',' + field.value + '&'
    });
    if (where.length > 0) {
      where += 'satisfy=all'
    }
    this._hs.get(this.table, where).subscribe(res => {
      this.items = res.json()[this.table];
      this.aggregate();
    });
  }

  aggregate() {
    this.aggrefields.forEach(field => {
      field.value = 0;
      this.items.forEach(rec => {
        if (field.groupas == 'sum')
          field.value += Number(rec[field.fieldname]);
        if (field.groupas == 'count')
          field.value++;
      });
    });
  }
  print(){

  }
}