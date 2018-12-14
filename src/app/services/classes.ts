import { HttpService } from "./http.service";
import { Item } from "../components/inventory/inventory.component";
import { ShareService } from "./share.service";

export class InventoryClass {
    public items: Item[] = [];
    public inventories: any[] = [];
    public inventroy = {
        storeid: 0,
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

    public additemtolist(item, storeid, list: any[],op:boolean): any[] {
        console.log("additemtolist storeid:", storeid);
        console.log("additemtolist item:", item);
        console.log("additemtolist list:", list);


        this.inventories = list;
        this.items = [];
        this.resetItem();

        console.log(item.id);

        this.storeexist = false;
        this.inventories.forEach(el => {
            if (el.storeid == storeid) {
                console.log(el.data);

                this.storeexist = true;
                this.isexist = false;
                el.data.forEach(element => {
                    console.log("element.id :", element.id, ":", element);

                    if (element.id == item.id) {
                        this.isexist = true;
                        if(op){
                            element.avb = element.avb + parseInt(item.avb);
                            element.rsv = element.rsv + parseInt(item.rsv);
                            element.com = element.com + parseInt(item.com);
                        }
                        else{
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

            this.inventroy.storeid = storeid;
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
