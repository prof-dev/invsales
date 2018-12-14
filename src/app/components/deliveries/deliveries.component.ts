import { Component, OnInit } from '@angular/core';
import { Choice } from '../sadad/sadad.component';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {
  public delivery:any={};
  public items:any[]=[];
  constructor() { }

  ngOnInit() {
  }

  getItems(){
    switch(this.delivery.type){
      case 'p':{
        break;
      }
      case 's':{
        break;
      }
      case 'rs':{
        break;
      }
      case 'rp':{
        break;
      }
      case 'fp':{
        break;
      }
      case 'tp':{
        break;
      }
      default:break;
    }

  }

  getPursalesItems(){

  }
  getPursalesRetItems(){
    
  }
  getStoreExchange(){
    
  }
  insertMovement(){

  }

  public types: Choice[] = [
    { value: 'p', viewValue: 'إستلام مشتريات' },
    { value: 's', viewValue: 'تسليم مبيعات' },
    { value: 'rs', viewValue: 'إستلام مردودات مبيعات' },
    { value: 'rp', viewValue: 'تسليم مردودات مشتريات' },
    { value: 'fs', viewValue: 'إستلام  بضاعة من مخزن آخر' },
    { value: 'ts', viewValue: 'تسليم  بضاعة إلى مخزن آخر' },



  ]
}
