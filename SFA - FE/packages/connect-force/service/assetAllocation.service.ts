import { serverDownErrorMessage } from "@/data/common-errors";
import {
    setAssetAllocationError,
    setAllAssetAllocationDetails,
    setPaginationDetails,
    setAssetAllocationMessage
} from "@/redux/slices/asset-allocation-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "assetallocation";

export const getAllAssetAllocationDetails = async (
    page?: number,
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean
) => {
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
        const assetAllocationDetails = get(response, "data.AssetAllocation", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllAssetAllocationDetails(assetAllocationDetails));
        dispatch(setPaginationDetails(paginationInfo));
    } catch (error: ErrorType | any) {
        dispatch(setAssetAllocationError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
}

export const createAssetAllocation = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
            data
        );
        const resData = response.data;
        dispatch(setAssetAllocationMessage(resData.message));
        return resData;
    } catch (error: ErrorType | any) {
        dispatch(setAssetAllocationError(
            error.response.data.details[0].description
        ));
        throw new Error(error.response.data.details[0].description);
    }
}