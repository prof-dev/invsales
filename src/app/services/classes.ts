import { HttpService } from "./http.service";
import { Item } from "../components/inventory/inventory.component";
import { ShareService } from "./share.service";

export class InventoryClass {
    public items: Item[] = [];
    public inventories: any[] = [];
    public inventroy = {
        id: 0,
        data: null
    };
    storeexist: boolean;
    isexist: boolean;
    public item = {
        id: 0,
        avb: 0,
        rsv: 0,
        com: 0
    };
    new: number[] = [];

    constructor(private _hs: HttpService, private _ss: ShareService) {
    }
    resetItem() {
        this.item = {
            id: 0,
            avb: 0,
            rsv: 0,
            com: 0
        };
    }

    public additemtolist(item, storeid, list: any[], op: boolean): any[] {/// true adds //false substracts
        console.log("additemtolist storeid:", storeid);
        console.log("additemtolist item:", item);
        console.log("additemtolist list:", list);


        this.inventories = list;
        this.items = [];
        this.resetItem();

        console.log(item.id);

        this.storeexist = false;
        this.inventories.forEach(el => {
            if (el.id == storeid) {
                console.log(el.data);

                this.storeexist = true;
                this.isexist = false;
                el.data.forEach(element => {
                    console.log("element.id :", element.id, ":", element);

                    if (element.id == item.id) {
                        this.isexist = true;
                        if (op) {
                            element.avb = element.avb + parseInt(item.avb);
                            element.rsv = element.rsv + parseInt(item.rsv);
                            element.com = element.com + parseInt(item.com);
                        }
                        else {
                            element.avb = element.avb - parseInt(item.avb);
                            element.rsv = element.rsv - parseInt(item.rsv);
                            element.com = element.com - parseInt(item.com);
                        }

                    }
                });
                if (!this.isexist) {
                    this.item.avb = parseInt(item.avb);
                    this.item.id = parseInt(item.id);
                    this.item.rsv = parseInt(item.rsv);
                    this.item.com = parseInt(item.com);
                    el.data.push(this.item);
                    this.resetItem();

                }
            }
        });
        if (!this.storeexist) {
            this.items = [];
            console.log("not exisit");
            // this.new.push(this.processinfo.store);

            this.inventroy.id = storeid;
            // [{ avb: number; id: number; rsv: number; com: number; }]
            console.log(this.inventroy);
            this.new.push(storeid);
            this.item.avb = parseInt(item.avb);
            this.item.id = parseInt(item.id);
            this.item.rsv = parseInt(item.rsv);
            this.item.com = parseInt(item.com);
            this.items.push(this.item);
            this.resetItem();
            this.inventroy.data = JSON.stringify(this.items); console.log('inv.data  :' + this.inventroy);
            console.log(this.inventroy);
            this.inventories.push(this.inventroy);
            this._hs.post('inventory', this.inventroy).subscribe(res => {

                this._ss.setSnackBar('inserted page is refreshed for you');

            });
        }




        return this.inventories;
    }
}



export class UtilityClass {
    constructor(){

    }
   public numbertToWords(num):string {
        var number = parseInt(num);
        if (number == 0) return ' ';

        var words = "";
        if (Math.floor(number / 1000000) > 0) {
            words += this.numbertToWords(Math.floor(number / 1000000)) + ' مليون ';
            number %= 1000000;
        }
        if (Math.floor(number / 1000) > 0) {
            words += this.numbertToWords(Math.floor(number / 1000)) + ' ألف ';
            number %= 1000;
        }
        if (Math.floor(number / 100) > 0) {
            words += this.numbertToWords(Math.floor((number / 100))) + ' مائة ';
            number %= 100;
        }
        if (number > 0) {
            if (words != "") { words += "  " }

            var unitmap = ['', 'واحد', 'اثنان', 'ثلاثة', 'اربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'احدى عشر', 'اثنا عشر', 'ثلاثة عشر', 'اربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
            var tensmap = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
            if (number < 20) words += unitmap[number];
            else {
                console.log('number/10', Math.floor(number / 10));
                console.log(number % 10);

                if ((number / 10) > 0) words += unitmap[number % 10];
                words += " و " + tensmap[Math.floor(number / 10)];

            }
        }
        return words;
    }
}