import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';



interface Data {
    name: string;
    address: string;
    balance: number;
}
interface Lookup {
    id: number;
    parent: number;
    isleaf: number;
    data: Data;
    group: string;
}



@Component({
    selector: 'app-suppcus',
    templateUrl: './suppcus.component.html',
    styleUrls: ['./suppcus.component.css']
})
export class SuppcusComponent implements OnInit {
    public rows: any = [];
    public keys: string[] = [];
    public lookup: Lookup[] = [];
    public theader: any = [];
    public details: any = {};

    constructor(private _ss: ShareService, private _hs: HttpService, ) { }
    ngOnInit() {
        this._hs.get('lookups?filter=parent,eq,1')
            .subscribe(res => {
                console.log(res.json());
                this.rows = res.json().lookups.records;
                this.theader = res.json().lookups.columns;


                console.log(this.rows);
                console.log(this.theader);
                for (let k in this.theader) {
                    this.keys.push(k);
                }
                var i = 1;
                this.rows.forEach(element => {
                    

                    this.lookup[i].id = element[0];
                    this.lookup[i].group = element[1];
                    this.lookup[i].parent = element[2];
                    this.lookup[i].isleaf = element[4];
                    if (element[3] != null) {
                        var temp = "'" + element.data + "'";
                        console.log(temp);
                        this.lookup[i].data = JSON.parse(element[3]);
                        console.log(element.data);
                    }

                    i++;



                });
            });
    }
}   