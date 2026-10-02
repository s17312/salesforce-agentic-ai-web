
import { serverDownErrorMessage } from "@/data/common-errors";
import { 
    startLoading,
    setAssetAllocationTypeError,
    setAllAssetAllocationTypeDetails,
    setPaginationDetails
 } from "@/redux/slices/asset-allocation-type-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "assetallocationtype";

export const getAllAssetAllocationTypeDetails = async (
    page?: number,
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean,
) => {
    dispatch(startLoading());
    try {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (searchKeyword) params.append("searchKeyword", searchKeyword);
        if (sortBy) params.append("sortColumn", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        if (isActive !== undefined) params.append("IsActive", isActive.toString());
        if (isArchive !== undefined) params.append("IsArchive", isArchive.toString());

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
        );

        const assetAllocationTypeDetails = get(response, "data.AssetAllocationType", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllAssetAllocationTypeDetails(assetAllocationTypeDetails));
        dispatch(setPaginationDetails(paginationInfo));
    } catch (error: ErrorType | any) {
        dispatch(setAssetAllocationTypeError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
        
    }
};
