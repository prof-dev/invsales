import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData, DialogsComponent } from '../components/dialogs/dialogs.component';
import { MatSnackBar } from '@angular/material';
import { ShareService } from './share.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  public thedata: DialogData
  private dialogRef: any;
  private user: any = {};
  public REPORTHEADER = '<!doctype html><html lang="ar"><head><title>Prining</title><style>' +
    'table {font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;width: 100%;}' +
    'table td, table th {border: 1px solid #ddd;}table td{height: 30px;padding-right: 5px;}table ' +
    'tr:nth-child(even){background-color: #f2f2f2;}table tr:hover {background-color: #ddd;}table' +
    ' th {padding-top: 5px;padding-bottom: 5px;padding-right: 5px;text-align: right;background-color: blue;color: white;}table mat-form-field{width:80px;}</style>' +
    '</head><body dir="rtl"><br><br><br><table><tr><td><b>الخرطوم السجانة</b><br><b>0123111000</b><br>' +
    '<b>Awadallah</b></td>' +
    '<td><h1>شركة هيفن</h1></td><td><img src="http://haven.mohamedosmanelsayed.com/assets/logo.jpg"></td></tr></table><br><br>';
  public REPORTFOOTER = '<br><br><b>التوقيع</b>:<br>----------------------------<br><b>اصدرت بواسطه</b>: ' + this.user.fullname + '<br><b>ملحوظات</b>:</body></html>';

  constructor(private dialog: MatDialog, private _ss: ShareService) {
    this.thedata = new DialogData();
    this._ss.User.subscribe(user => {
      this.user = user;
      this.REPORTFOOTER = '<br><br><b>:التوقيع</b><br>----------------------------<br><b>:اصدرت بواسطه</b> ' + this.user.fullname + '<br><b>:ملحوظات</b></body></html>';
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
      width: this.thedata.type === 'getsupplier' ? '600px' : '300px',
      data: this.thedata
    });
  }

  showReport(title: string) {
    var w = window.open();

    w.document.write(this.REPORTHEADER + '<h3>' + title + '</h3>');
    var divs = document.getElementsByClassName('printdiv');
    for (var i = 0; i < divs.length; i++) {
      var ele = divs.item(i);
      w.document.write(ele.innerHTML + '<br>');
    }
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
export interface SearchFeild {
  type: string;
  placeholder?: string;
  fieldname: string;
  operator?: string;
  value?: any
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
  public fromdate: any;
  public todate: any;

  constructor(table: string, private _hs: HttpService, private _ut: UtilsService) {
    this.ready = 0;
    this.table = table;
    this.searchfields = [];
    this.aggrefields = [];
    this.fromdate = '';
    this.todate = '';
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
        this.searchfields.push({ type: 'date', fieldname: 'date' });
        this.aggrefields.push({ fieldname: 'totalprice', groupas: 'sum', title: 'مجموع الرصيد' });
        this.aggrefields.push({ groupas: 'count', title: 'عدد المعاملات' });
        ++this.ready;
        break;
      case 'pursalesret':
        this.title = 'تقرير المردودات';
        this.searchfields.push({ type: 'string', fieldname: 'type', operator: 'eq', placeholder: 'نوع المردودات', value: 's' });
        this.searchfields.push({ type: 'number', fieldname: 'entityid', operator: 'eq', placeholder: 'رقم العميل', value: '0' });
        this.searchfields.push({ type: 'date', fieldname: 'date' });
        this.aggrefields.push({ fieldname: 'totalprice', groupas: 'sum', title: 'مجموع الرصيد' });
        this.aggrefields.push({ groupas: 'count', title: 'عدد المعاملات' });
        ++this.ready;
        break;
      case 'suppcus':
        this.title = 'تقرير العملاء والموردين';
        this.searchfields.push({ type: 'string', fieldname: 'type', operator: 'eq', placeholder: 'عملاء أو موردين', value: 's' });
        this.searchfields.push({ type: 'number', fieldname: 'entityid', operator: 'gt', placeholder: 'رقم العميل اكبر من', value: '0' });
        this.aggrefields.push({ fieldname: 'totalprice', groupas: 'sum', title: 'مجموع الرصيد' });
        this.aggrefields.push({ groupas: 'count', title: 'عدد المعاملات' });
        ++this.ready;
        break;
      case 'users':
        this.title = 'تقرير  المستخدمون';
        this.searchfields.push({ type: 'string', fieldname: 'roles', operator: 'cs', placeholder: 'الأدوار المعطاة', value: '0' });
        this.searchfields.push({ type: 'number', fieldname: 'balance', operator: 'gt', placeholder: 'الرصيد أكبر من', value: '0' });
        this.aggrefields.push({ fieldname: 'balance', groupas: 'sum', title: 'مجموع الرصيد' });
        this.aggrefields.push({ groupas: 'count', title: 'عدد المستخدمين' });
        ++this.ready;
        break;
      default:
        break;
    }
  }

  search() {
    var from = '';
    var to = '';
    console.log('this report: ', this);
    var where = '';
    this.searchfields.forEach(field => {
      console.log('Field in the search: ', field);

      if ((field.type == 'string' || field.type == 'number') && field.value.length > 0) {
        where += 'filter[]=' + field.fieldname + ',' + field.operator + ',' + field.value + '&'
      }
      if (field.type == 'date') {
        from = this.fromdate.toISOString().split('T')[0];
        to = this.todate.toISOString().split('T')[0];
        field.placeholder = 'التاريخ :';
        field.value = ' من تاريخ ' + from + ' الى تاريخ ' + to;
        console.log('from to: ', from, to);

        where += 'filter[]=' + field.fieldname + ',bt,' + from + ',' + to + '&'
      }
    });
    if (where.length > 0) {
      where += 'satisfy=all'
    }
    console.log('where: ', where);

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
  print() {
    this._ut.showReport(this.title);
  }
}

export class ReturnsObject {
  public id: number;
  public type: string;
  public name: string;
  public row: any = {};
  public itemsarr:any[]=[];
  private itemsids: number[];
  public inrets: boolean;
  public ready: boolean;
  public suppcusname: string;
  constructor(private _ht: HttpService) {
    this.id = 0;
    this.type = 's';
    this.row = {};
    this.name = '';
    this.suppcusname = '';
    this.itemsids = [0];
    this.inrets = false;
    this.ready = false;
  }
  reset() {
    this.suppcusname='';
    this.row = {};
    this.itemsids = [0];
    this.inrets = false;
    this.ready = false;
  }
  buildItemsIds() {
    this.row.data.items.forEach(itm => {
      this.itemsids.push(itm.id);
    });
  }
  getItems() {
    this._ht.get('suppcus', 'filter=id,eq,' + this.row.entityid).subscribe(res => {
      this.suppcusname = res.json().suppcus[0].fullname;
    });
    return this._ht.get('items', 'filter[]=id,in,' + this.itemsids )
  }

  saveApplication() {
    let therow: any = JSON.parse(JSON.stringify(this.row));
    therow.locked = 0;
    therow.data.items.forEach(itm => {
      delete itm.name;
    });
    therow.data = JSON.stringify(therow.data);
    if (this.ready) {
      if (this.inrets) {
        return this._ht.put('pursalesret', 'id', therow);
      } else {
        return this._ht.post('pursalesret', therow);
      }
    }
  }

  fixItems(items: any[]) {
    this.row.data.items.forEach(rec => {
      var recitem: any = items.find(el => { return rec.id == el.id });
      if (recitem)
        rec.name = recitem.arname;
    });
    this.ready = true;
    console.log('this.ready:', this.ready);
  }

}