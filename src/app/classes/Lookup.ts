
interface AccountsData{
    balance:number;

}


export class Banks{
    group:string;
    id:number;
    parent:number;
    isleaf:number;
    data:AccountsData;

}



export class Tresuries{
    group:string;
    id:number;
    parent:number;
    isleaf:number;
    data:AccountsData;

}
