export interface OutletStatus {
  uId?: number;
  isArchive?: boolean | null;
  active?: boolean | null;
  creationDate?: Date | null;
  modifiedDate?: Date | null;
  totalRecordCount?: number | null;
  createdBy?: number | null;
  modifiedBy?: number | null;
  outletStatusID?: string | null;
  statusName?: string | null;
  description?: string | null;
}
