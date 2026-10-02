export interface OutletsByRepresentativeId {
  outletUID?: number;
  outletID?: string;
  name?: string;
  contactNo1?: string;
  outletCategory?: string;
  outletClassification?: string;
  checkedStatus?: boolean;
}

export interface OutletsByRepresentativeIdPagedResults {
  items?: Array<OutletsByRepresentativeId> | null;
}
