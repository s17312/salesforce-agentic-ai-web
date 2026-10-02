import { Outlet } from "connect-force-api-client";
import { Asset } from "./asset-types";
import { Company } from "./company-types";
import { Distributor } from "./distributor-types";

export type AssetAllocationState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    assetAllocationDetails: AssetAllocation[];
    isActive: true;
    assetAllocation: AssetAllocation | null;
    newPage: number;
    newRowsPerPage: number;
    message: string | null;
}

export type Pagination = {
    pageNo: number;
    pageSize: null;
    results: number;
    total: number;
};

export type AssetAllocation = {
    uId: number;
    comment: string | null;
    assetUId: number;
    assetUIds?: string[] | null;
    companyUId: number;
    distributorUId: number;
    outletUId: number;
    repairUId: number;
    disposalUId: number;
    currentLocation: string;
    allocationDate: string; // Date string in ISO format
    active: boolean;
    isArchive: boolean;
    creationDate: string; // Date string in ISO format
    createdBy: number;
    asset: Asset | null;
    company: Company | null;
    distributor: Distributor | null;
    outlet: Outlet | null;
    modifiedDate: string | null; // Nullable date string in ISO format
    totalRecordCount: number;
    modifiedBy: number;
    allocationType?: string | null;
}

export type FormValuesPropsAssetAllocation = {
    comment: string | null;
    assetUIds: string[] | null;
    companyUId: number | null;
    distributorUId?: number | null;
    outletUId?: number | null;
    repairUId?: number | null;
    disposalUId?: number | null;
    allocationDate?: string | null;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy?: string | null;
    modifiedDate?: string | null;
    active: boolean;
    allocationType?: string | null;
};