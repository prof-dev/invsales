interface Details{
    OnlineOrderFlag: number;
    SalesOrderNumber: number;
    PurchaseOrderNumber: number;
    AccountNumber: string;
    CustomerID: number;
    SalesPersonID: number;
    TerritoryID: number;
    BillToAddressID: number;
    ShipToAddressID: number;
    ShipMethodID: number;
    CreditCardID: number;
    CreditCardApprovalCode: string;
    CurrencyRateID: number;
    SubTotal: number;
    TaxAmt: number;
    Freight: number;
    TotalDue: number;
    Comment: string;
    rowguid: string;
    ModifiedDate: string;  
}

export class SalesOrder {
    SalesOrderID: number;
    OrderDate: string;
    DueDate: string;
    ShipDate: string;
    Status: number;
    CustomerID: number;
    details:Details;
   
}