import { CommonStatus, NumberIdEntity, Role, StringIdEntity } from "../enums/common.enum";

export interface User {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  name?: string;
  birthDay?: number;
  phone?: string;
  avatar?: string;
  username?: string;
  password?: string;
  email?: string;
  gender?: string;
  rankId?: number;
  nextRankId?: number;
  rankExpiredAt?: number;
  sellerId?: number;
  displayName?: string;
  employeeCode?: string;
  note?: string;
  status: CommonStatus
  rank?: Rank
  erpPartners?: ErpPartner[]
  roles?: UserRole[]
}
export interface UserRole extends StringIdEntity {
  name: String,
  value: Role
}

export interface ErpPartner extends NumberIdEntity{
  erpCategoryId?: number;
  erpId?: number
  sellerId?: number
  userId?: string
}

export interface Rank extends NumberIdEntity{
  name: string
}