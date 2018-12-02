import { Component, OnInit, Inject } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';


@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.css']
})
export class LookupsComponent implements OnInit {
  public user: any;
  public nodes: any[] = [];
  public lookups: any[] = [];
  public lookupitems: any[] = [];
  public group: any = null;
  public visible: boolean;
  public operation: string = "new";
  public form: boolean = false;
  public processinfo = {
    objecttype: 0,
    processtype: true

  };

  public opengroup: boolean;
  public bank: any;
  public data: any;
  filterby: any;
  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router, private _ut: UtilsService) { }
  ngOnInit() {
    this.refresh();
  }
  public refresh() {
    this._ss.User.subscribe(user => {
      this.user = user;
      if (this.user.id == 0) {
        this._router.navigateByUrl('/login');
      }
      else {
        this._hs.get('lookups', 'filter=isleaf,eq,0')
          .subscribe(res => {
            this.lookups = res.json().lookups;
            console.log(this.lookups);
          });
      }
    });
  }

  setGroup(group) {
    this.processinfo = {
      objecttype: 0,
      processtype: true
    };
    this.visible = true;
    this.data = {
      address: "", balance: 0, price: 0
    };
    if (group == null) {
      this.bank = {
        group: "",
        id: null,
        parent: 0,
        isleaf: 0,
        titleen: "",
        titlear: "",
        data: null
      };
      this.group = this.bank;
      this.group.data = this.data;
    } else {
      this.bank = {
        group: group.group,
        id: null,
        parent: 0,
        isleaf: 0,
        titleen: "",
        titlear: "",
        data: null
      };
      this.group = group;
      this.group.data = this.data;
      this.form = false;
      if (group.id == null) {
        this.filterby = 0;
      }
      else {
        this.filterby = group.id;
      }

      this._hs.get('lookups', 'filter[]=parent,eq,' + this.filterby)
        .subscribe(res => {
          this.lookupitems = res.json().lookups;

        })

      this.visible = true;
      console.log("group is set to:", group.group);


    }

  }

  modify(item) {
    this.processinfo.processtype = false;
    this.visible = false;
    this.operation = "تعديل";
    this.form = true;
    this.data = JSON.parse(item.data);
    console.log(JSON.parse(item.data));

    this.bank.titlear = item.titlear;
    this.bank.id = item.id;
    this.bank.group = item.group;
    this.bank.isleaf = item.isleaf;
    this.bank.parent = item.parent;
    this.bank.data = this.data;


    this.bank.titleen = item.group;
    this.visible = false;

  }


  dodelete(item): void {
    this._hs.delete('lookups', item.id, item).subscribe(res => {
      if (res.json() == 1) {

        this._ss.setSnackBar("تم الحذف بنجاااح");

      }
    });


  }



  addnewlookup() {
    this.processinfo.processtype = true;
    this.setGroup(null);
    this.form = true;
    this.operation = "إدخال جديد";
    this.bank.titlear = "";
    this.bank.group = "";
    this.data.address = "";
    this.data.balance = 0;
    this.data.price = 0;
    this.bank.titleen = this.bank.group;
    this.visible = false;


    this.bank.parent = 0;
  }

  addnewitem(parent) {
   
    this.setGroup(parent);
    this.visible = false;
    this.form = true;
    this.operation = "إدخال جديد";
    this.bank.titlear = "";
    this.data.address = "";
    this.data.balance = 0;
    this.data.price = 0;
    this.bank.titleen = "";

    this.visible = false;


    this.bank.parent = parent.id;
  }

  save(item, d) {

    if (item.id == null) {
      if (this.processinfo.objecttype != 0) {
        this.bank.isleaf = 1;
      }
      this.bank.data = JSON.stringify(d);
      console.log(item.data);
      this._hs.post('lookups', item).subscribe(res => {

        console.log("تمت إضافة " + this.group.titlear + " id :" + res.toString());

      })

    }
    else {
      item.data = JSON.stringify(d);
      console.log(item.selected);

      this._hs.put('lookups', "id", item).subscribe(res => {

        console.log("تمت تعديل " + this.group.titlear + " id :" + res.json());

      })
    }

    // this._router.navigateByUrl('/lookups'); 
    this.ngOnInit();
    this.form = false;


  }

  setgroupname(id) {
    console.log(id);
    if (id == 2) {
      this.bank.group = 'item';
      this.opengroup = false;
    }
    else
      if (id == 3) {
        this.bank.group = 'spending';
        this.opengroup = false;
      }
      else {
        this.bank.group = '';
        this.opengroup = true;
      }
  }

  deleteitem(item) {

    this._ut.messageBox('confirm', 'تأكيد احذف', 'هل أنت متأكد من حذف العنصر؟')
      .afterClosed()
      .subscribe(result => {
        if (result == 'ok') {
          console.log('res: ', this._ut.thedata.result);
          this.dodelete(item);

        }
      });
  }
  public leaf: Choice[] = [
    { value: '1', viewValue: 'فرع نهائي' },
    { value: '2', viewValue: 'بضاعة ' },
    { value: '3', viewValue: ' بنود صرف' },
    { value: '0', viewValue: 'قسم رئيسي / أو فرعي' }]



}



interface Choice {
  value: string;
  viewValue: string;
}

