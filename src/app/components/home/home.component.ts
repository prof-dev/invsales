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
    public row: any={};
    constructor(private _ss: ShareService, private _ht: HttpService) { }
    ngOnInit() { }

    webToLocal(table) {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://www.prof-dev.com/api.php/' + table.name + '?transform=1').subscribe(res => {
            var rows = res.json()[table.name];
            this._ht._http.post('http://localhost/invsales/api.php/' + table.name, rows).subscribe(res1 => {
                var num = res1.json().split(',').length;
                this._ss.setSnackBar('Around ' + num + ' rows were transferred to LOCAL');
                this._ss.setAppIsBusy(false);
            });
        });
    }
    localToWeb(table) {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://localhost/invsales/api.php/' + table.name + '?transform=1').subscribe(res => {
            var rows = res.json()[table.name];
            this._ht._http.post('http://www.prof-dev.com/api.php/' + table.name, rows).subscribe(res1 => {
                var num = res1.json().split(',').length;
                this._ss.setSnackBar('Around ' + num + ' rows were transferred to WEB');
                this._ss.setAppIsBusy(false);
            });
        });
    }
    showTables() {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://localhost/invsales/api.php').subscribe(res => {
            this.tags = res.json().tags;
            this._ss.setAppIsBusy(false);
        });
    }
    showRow(table) {
        this._ss.setAppIsBusy(true);
        this._ht._http.get('http://www.prof-dev.com/api.php/' + table.name + '?transform=1').subscribe(res => {
            this.row =res.json()[table.name][0];
            this._ss.setAppIsBusy(false);
        });

    }
}                          