
interface AccountsData{
    balance:number;
    address:string;

}
export class Data{
    address="";balance=0;
}


export class Banks{
    group:string="";
    id:number=null;
    parent:number=0;
    isleaf:number=0;
    data:Data;
    titleen:string="";
    titlear:string="";

}


export class Tresuries{
    group:string;
    id:number;
    parent:number;
    isleaf:number;
    data:AccountsData;
    titleen:string;
    titlear:string;

}


export class Check {
    id: number;
    checkno: string;
    bank: string;
    date: Date;
    status: string;
    clarified: number;
    checkowner: string;
    lastholder: string;
    amount: number;
    source :string;
  }