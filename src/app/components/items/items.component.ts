import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  public processinfo = {
    file: ""
  };
  public productsview: any[] = [];
  public lookups: any[] = [];
  public list: any[] = [];
  public goodsobj: any = {};
  public classes: any[] = [];
  public item = {
    parent: 0,
    id: 0,
    barcode: "",
    arname: "",
    engname: "",
    data: ""
  };
  blob: any[];
  public data = {
    image: "",
    price: 0.00
  }



  constructor(private _hs: HttpService,
    private _ss: ShareService,
    private _router: Router) { }

  ngOnInit() {
    this.getAllItems();
    this.getallclasses();
   

  }

  reset() {
    this.item = {
      parent: 0,
      id: 0,
      barcode: "",
      arname: "",
      engname: "",
      data: ""
    };

    this.data = {
      image: "",
      price: 0.00
    }

  }


  // getitemsbyclass() {
  //   if (this.item.parent != 0) {
  //     console.log(this.item.parent);
  //     console.log(this.productsview);

  //     console.log(this.list);

  //     this.list = this.productsview.filter(option => option.parent == this.item.parent);
  //     console.log(this.list);
  //   }
  // }

  private getallclasses() {
    this._hs.get('lookups', 'filter=group,eq,goods')
      .subscribe(res => {
        this.goodsobj = res.json().lookups[0];
        // console.log(this.goodsobj);
        this._hs.get('lookups', 'filter[]=parent,eq,' + this.goodsobj.id)
          .subscribe(res => {
            this.classes = res.json().lookups;
            console.log(this.classes);

          });
      });
  }

  private getAllItems() {
    this._hs.get('items')
      .subscribe(res => {
        console.log(res.json());
        
        this.productsview = res.json().items;

        console.log(this.productsview);
      
        this.productsview.forEach(element => {
          this.data = JSON.parse(element.data);
          element.data=this.data;
          console.log(element.data.image);
          
          
          this.reset();
        });
      })
      
   
  }


  insertitem() {
    console.log("hello");

    this.item.data = JSON.stringify(this.data);
    this._hs.post('items', this.item).subscribe(res => {
      this.item.id = Number(res.text());

    });
    if (this.item.id != 0) {
      this._ss.setSnackBar("تم الحفظ بنجاح");
    }

    this.reset();
    this.getAllItems();

  }
  file: any;
  print(filelocation) {
    this.file = filelocation.target.files[0];
    console.log(this.file);
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.data.image = fileReader.result.toString();
    }
    fileReader.readAsDataURL(this.file);
    console.log(fileReader.result);


    this.data.image = fileReader.result + "";


  }
}
