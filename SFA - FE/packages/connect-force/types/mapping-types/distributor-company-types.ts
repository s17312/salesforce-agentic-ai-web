export interface CompanyByDistributorId {
  companyUId?: number;
  companyID?: string;
  companyName?: string;
  checkedStatus?: boolean;
}
export interface CompaniesByDistributorIdPagedResults {
    items?: Array<CompanyByDistributorId> | null;
  }
