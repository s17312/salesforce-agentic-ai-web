import { Company } from "./company";
import { PagedResultStatus } from "./paged-result-status";

export interface CompanyPagedResult {
  items?: Array<Company> | null;
  paging?: PagedResultStatus;
}
