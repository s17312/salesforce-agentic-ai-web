import { serverDownErrorMessage } from "@/data/common-errors";
import {
    setAllAssetDetails,
    startLoading,
    setPaginationDetails,
    setAssetError,
    setAssetMessage,
    setAsset,
    setAllAllocationAssetDetails
} from "@/redux/slices/asset-slice";
import { dispatch } from "@/redux/store";
import { FormValuesPropsAsset } from "@/types/asset-types";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "asset";

export const getAllAssetDetails = async (
    page?: number,
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean,
    location?: string,
    assignStatus?: number
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
        if (isArchive !== undefined)
            params.append("IsArchive", isArchive.toString());
        if (location) params.append("location", location);
        if (assignStatus !== undefined) params.append("assignStatus", assignStatus.toString());

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
        );

        const assetDetails = get(response, "data.Asset", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllAssetDetails(assetDetails));
        dispatch(setPaginationDetails(paginationInfo));
    } catch (error: ErrorType | any) {
        dispatch(setAssetError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
};

export const getAllAllocationAssetDetails = async (
    page?: number,
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean,
    location?: string,
    assignStatus?: number
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
        if (isArchive !== undefined)
            params.append("IsArchive", isArchive.toString());
        if (location) params.append("location", location);
        if (assignStatus !== undefined) params.append("assignStatus", assignStatus.toString());

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
        );

        const assetDetails = get(response, "data.Asset", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllAllocationAssetDetails(assetDetails));
        dispatch(setPaginationDetails(paginationInfo));
    } catch (error: ErrorType | any) {
        dispatch(setAssetError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
};

export const updateAssetStatus = async (
    uid: number | undefined,
    data: any
) => {
    try {
        const response = await axiosInstance.patch(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
            data
        );
        const updatedAssetData = get(response, "data.result", []);
        dispatch(
            setAllAssetDetails({
                data: updatedAssetData,
                update: true,
            })
        );
        const resData = response.data;
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(setAssetError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
};

export const createAsset = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
            data
        );
        const resData = response.data;
        dispatch(setAssetMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(
            setAssetError(
                error.response.data?.details[0]?.description || serverDownErrorMessage
            )
        );
        throw new Error(error.response.data.details[0].description);
    }
}

export const updateAsset = async (
    uid: number | undefined,
    data: FormValuesPropsAsset
) => {
    try {
        const response = await axiosInstance.put(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
            data
        );
        const resData = response.data;
        dispatch(setAssetMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(
            setAssetError(
                error.response.data?.details[0]?.description || serverDownErrorMessage
            )
        );
        throw new Error(error.response.data.details[0].description);
    }
};

export const getAssetById = async (uid: number) => {
    try {
        await axiosInstance
            .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
            .then((response) => {
                const currentAssetData = get(response, "data.result", []);

                dispatch(setAsset(currentAssetData));
            });
    } catch (error: ErrorType | any) {
        dispatch(
            setAssetError(
                error.response.data?.details[0]?.description || serverDownErrorMessage
            )
        );
        throw new Error(error.response.data.details[0].description);
    }
};

export const getAllAssetDetailsByLocation = async (
    page?: number,
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean,
    locationTypeUId?: number,
    locationUId?: number,
    assignStatus?: number
) => {
    try {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (searchKeyword) params.append("searchKeyword", searchKeyword);
        if (sortBy) params.append("sortColumn", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        if (isActive !== undefined) params.append("IsActive", isActive.toString());
        if (isArchive !== undefined)
            params.append("IsArchive", isArchive.toString());
        if (locationTypeUId) params.append("locationTypeUId", locationTypeUId.toString());
        if (locationUId) params.append("locationUId", locationUId.toString());
        if (assignStatus !== undefined) params.append("assignStatus", assignStatus.toString());

        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/location?LocationTypeUId=${locationTypeUId}&LocationUId=${locationUId}&AssignStatus=true&IsActive=true`
        );

        const assetDetailsByLocation = get(
            response,
            "data.Asset",
            []
        )
        return assetDetailsByLocation;
    } catch (error: ErrorType | any) {
        console.error("Error fetching assets:", error);
        throw new Error();
    }
};
