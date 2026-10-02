import { PagedResultStatus } from "connect-force-api-client";

export interface UOM {
  uId?: number;
  uomId?: string | null;
  shortName?: string | null;
  description?: string | null;
  isNotBaseUnit?: boolean | null;
  baseUnitUId?: number | null;
  count?: number | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active?: boolean;
}

export interface ViewUOM {
  uId?: number;
  uomId?: string | null;
  shortName?: string | null;
  description?: string | null;
  isNotBaseUnit?: boolean | null;
  baseUnitUId?: number | null;
  baseUOM?: UOM | null;
  count?: number | null;
  createdBy: string;
  creationDate: string;
  modifiedBy: string;
  modifiedDate: string;
  active?: boolean;
}

export interface UOMPagedResult {
  items?: Array<UOM> | null;
  paging?: PagedResultStatus;
}

export interface AddEditUOM {
  uId?: number;
  uomId?: string | null;
  shortName?: string | null;
  description?: string | null;
  isNotBaseUnit?: boolean | null;
  baseUnitUId?: number | null;
  count?: number | 0;
}
