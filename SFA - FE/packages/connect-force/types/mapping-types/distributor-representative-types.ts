export interface RepresentativeByDistributorId {
  representativeUId?: number;
  representativeID?: string;
  name?: string;
  email?: string;
  contactNo?: string;
  checkedStatus?: boolean;
}
export interface RepresentativesByDistributorIdPagedResults {
  items?: Array<RepresentativeByDistributorId> | null;
}
