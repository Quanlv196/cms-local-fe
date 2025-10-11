export interface StringIdEntity {
    updatedAt?: number;
    createdAt?: number;
    id?: string;
}


export interface NumberIdEntity {
    updatedAt?: number;
    createdAt?: number;
    id?: number;
}



export enum CommonStatus{
    disable = "disable",
    active = "active"
}

export enum Role {
    internal = "internal",
    admin = "admin",
    customer = "customer",
    seller = "seller",
    employee = "employee",
  }
  