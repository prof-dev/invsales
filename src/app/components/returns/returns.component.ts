import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.css']
})
export class ReturnsComponent implements OnInit {

  public returns:any={
    type:'',
  }
  public inv=[
    {idx:1, name:'Product 1', qty:14, return:0},
    {idx:2, name:'Product 2', qty:11, return:0},
    {idx:3, name:'Product 3', qty:104, return:0},
    {idx:4, name:'Product 4', qty:414, return:0},
    {idx:5, name:'Product 5', qty:124, return:0},
    {idx:6, name:'Product 6', qty:12, return:0},
  ];
  constructor() { }

  ngOnInit() {
    
  }

}
