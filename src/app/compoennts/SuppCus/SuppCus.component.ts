import { Component, OnInit} from '@angular/core';
import {ShareService} from '../../services/share.service';  
import {HttpService} from '../../services/http.service';  



interface Data {
    name: string;
    address: string;
    balance:number;
  }
  interface Lookup {
    id: number;
    parent: number;
    leaf: number;
    data:Data;
    group:string;
  }
  
 

@Component({
    selector: 'app-SuppCus',
    templateUrl: './SuppCus.component.html',
    styleUrls: ['./SuppCus.component.css']
})
export class SuppCusComponent implements OnInit {
    public suppcus:any=[];
    public keys:string[]=[];
    public lookup:Lookup[]=[];
    
    public details:any={};
    
    constructor(private _ss:ShareService, private _hs:HttpService, ) {}
    ngOnInit() {
        this._hs.get('lookups')
            .subscribe(res=>{
                console.log(res.json());
                this.suppcus=res.json().lookups;
                this.lookup=this.suppcus;
             
             
                console.log(this.suppcus);
                for(let k in this.suppcus[0]){
                    this.keys.push(k);
                }

                this.suppcus.forEach(element => {
                   
                    if(element.data!=null){
                      var  temp="'"+element.data+"'";
                      console.log(temp);
                        element.data=JSON.parse(element.data);
                        console.log(element.data.balance);
                    }
          
                   
                    
                });
            });
    }
}   