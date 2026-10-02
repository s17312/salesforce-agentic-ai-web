import { PagedResultStatus } from "connect-force-api-client";

export interface OutletClassification {
  uId?: number;
  isArchive?: boolean | null;
  active?: boolean | null;
  creationDate?: Date | null;
  modifiedDate?: Date | null;
  totalRecordCount?: number | null;
  createdBy?: number | null;
  modifiedBy?: number | null;
  classificationID?: string | null;
  classification?: string | null;
  description?: string | null;
}

export interface OutletClassificationPagedResult {
  items?: Array<OutletClassification> | null;
  paging?: PagedResultStatus;
}
