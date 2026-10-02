import { LegalEntryType } from "./legal-entry-type";

export interface CompanyDTO {
  uId?: number;

  companyId?: string | null;

  companyName?: string | null;

  legalEntryTypeUId?: number;

  legalEntryType?: LegalEntryType;
  registeredAddress?: string | null;

  phoneNo?: string | null;

  email?: string | null;

  taxID?: string | null;

  companySize?: string | null;

  industry?: string | null;

  siCcode?: string | null;

  comments?: string | null;

  addressLine1?: string | null;

  addressLine2?: string | null;

  vatNo?: string | null;

  phoneNoCountryCode?: string | null;

  active?: boolean;

  isArchive?: boolean;

  creationDate?: Date;

  modifiedDate?: Date | null;

  totalRecordCount?: number;

  createdBy?: number;

  modifiedBy?: number;
}
