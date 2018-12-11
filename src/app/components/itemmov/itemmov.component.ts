import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-itemmov',
  templateUrl: './itemmov.component.html',
  styleUrls: ['./itemmov.component.css']
})
export class ItemmovComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  /*itemmov component
  
  1. get invoice(pursales/pursalesret) by invoice id 
  2.display all items.
  3.if invoice is pursales && type='s'
    a.substract the delivered quantity of each item in the invoice from the avb in table inventories.
    b.save the transaction of each item independantly to table itemmov including the storeid+the changed avb the.
    c.the dir column in itemmov should be set to 'out'
  
    if  invoice is pursales && type='p' or invoice is pursalesret
    a.add the delivered quantity of each item in the invoice from the avb in table inventories.
    b.save the transaction of each item independantly to table itemmov including the storeid+the changed avb the.
    c.the dir column in itemmov should be set to 'in'
  
  
  */



}
