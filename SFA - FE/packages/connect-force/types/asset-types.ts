import { AssetModel } from "./asset-model-types";
import { AssetBrand } from "./assetBrand-types";
import { AssetType } from "./assetType-types";
import { Company } from "./company-types";

export type AssetState = {
    isLoading: boolean;
    error: string | null;
    paginationDetails: Pagination | null;
    assetDetails: Asset[];
    allocationAssetDetails: Asset[], 
    isActive: true;
    asset: Asset | null;
    newPage: number;
    newRowsPerPage: number;
    message: string | null;
};

export type Pagination = {
    pageNo: number;
    pageSize: null;
    results: number;
    total: number;
};

export type Asset = {
    uId: number;
    assetId: string;
    assetName: string;
    assetTypeUID: number;
    assetTypeName?: string;
    assetType?: AssetType | null;
    assetBrandUId: number;
    assetBrandName?: string;
    assetBrand?: AssetBrand | null;
    assetModelUId: number;
    assetModelName?: string;
    assetModel?: AssetModel | null;
    serialNumber: number;
    manufacturer: string;
    purchaseDate: Date;
    cost: number;
    guaranteeInformation: string;
    maintenanceSchedule: Date;
    additionalNotes: string;
    companyUId: number | null;
    company?: Company | null;
    assignStatus?: number | null;
    location?: string | null;
    locationTypeUId?: number | null;
    locationUId?: number | null;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy?: string | null;
    modifiedDate?: string | null;
    totalRecordCount: number;
    active: boolean;
};

export type FormValuesPropsAsset = {
    uId: number | null;
    assetId: string | null;
    assetName: string | null;
    assetTypeUID: number | null;
    assetTypeName?: string | null;
    assetType?: AssetType | null;
    assetBrandUId: number | null;
    assetBrandName?: string | null;
    assetBrand?: AssetBrand | null;
    assetModelUId: number | null;
    assetModelName?: string | null;
    assetModel?: AssetModel | null;
    serialNumber: number | null;
    manufacturer: string | null;
    purchaseDate: Date | null;
    cost: number | null;
    guaranteeInformation: string | null;
    maintenanceSchedule: Date | null;
    additionalNotes: string | null;
    companyUId?: number | null;
    assignStatus?: number | null;
    locationTypeUId?: number | null;
    locationUId?: number | null;
    createdBy: string;
    creationDate: string;
    isArchive: boolean;
    modifiedBy?: string | null;
    modifiedDate?: string | null;
    active: boolean;
};