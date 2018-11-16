import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  nodes = [
    {
      id: 1,
      name: 'ضبط النظام',
      children: [
        { id: 2, name: 'المستخدمين' },
        { id: 3, name: 'الاصناف' }
      ]
    },
    {
      id: 4,
      name: 'المبيعات',
      children: [
        { id: 5, name: 'أمر بيع' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  options = {};
}
