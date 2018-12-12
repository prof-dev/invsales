import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public tags: any[] = [];
    public row: any = {};
    constructor(private _ss: ShareService, private _ht: HttpService) { }
    ngOnInit() { }

    webToLocal(table) {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://www.prof-dev.com/api.php/' + table.name + '?transform=1').subscribe(res => {
            var rows = res.json()[table.name];
            this._ht._http.post('http://localhost:83/api.php/' + table.name, rows).subscribe(res1 => {
                this._ss.setAppIsBusy(false);
                var num = res1.json().length;
                this._ss.setSnackBar('Around ' + num + ' rows were transferred to LOCAL');
            });
        });
    }
    localToWeb(table) {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://localhost:83/api.php/' + table.name + '?transform=1').subscribe(res => {
            var rows = res.json()[table.name];
            this._ht._http.post('http://www.prof-dev.com/api.php/' + table.name, rows).subscribe(res1 => {
                this._ss.setAppIsBusy(false);
                var num = res1.json().length;
                this._ss.setSnackBar('Around ' + num + ' rows were transferred to WEB');
            });
        });
    }
    showTables() {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://localhost:83/api.php').subscribe(res => {
            this._ss.setAppIsBusy(false);
            this.tags = res.json().tags;
        });
    }
    showRow(table) {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://www.prof-dev.com/api.php/' + table.name + '?transform=1').subscribe(res => {
            this._ss.setAppIsBusy(false);
            this.row = res.json()[table.name][0];
        });

    }
}                          