export interface OutletsByDistributorId {
  outletUId?: number;
  outletID?: string;
  name?: string;
  checkedStatus?: boolean;
}

export interface OutletsByDistributorIdPagedResults {
  items?: Array<OutletsByDistributorId> | null;
}
