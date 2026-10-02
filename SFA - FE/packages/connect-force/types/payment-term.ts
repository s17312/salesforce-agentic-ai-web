import { PagedResultStatus } from "connect-force-api-client";

export interface PaymentTerm {
  uId?: number;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active?: boolean;
}

export interface PaymentTermPagedResult {
  items?: Array<PaymentTerm> | null;
  paging?: PagedResultStatus;
}
