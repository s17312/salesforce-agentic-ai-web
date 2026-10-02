import { serverDownErrorMessage } from "@/data/common-errors";
import { setAllUnloadingReasonDetails, setPaginationDetails, setUnloadingReason, setUnloadingReasonError, setUnloadingReasonMessage, startLoading } from "@/redux/slices/unloading-Reason-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsUnloadingReason } from "@/types/unloading-reason-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "unloadingreason";

export const getAllUnloadingReasonDetails = async (
    page?: number,
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean
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

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
        );
        const unloadingReasonDetails = get(response, "data.UnloadingReason", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllUnloadingReasonDetails(unloadingReasonDetails));
        dispatch(setPaginationDetails(paginationInfo));
    } catch (error: ErrorType | any) {
        dispatch(setUnloadingReasonError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
};

export const updateUnloadingReasonStatus = async (
    uid: number | undefined,
    data: any
) => {
    try {
        const response = await axiosInstance.patch(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
            data
        );
        const updatedUnloadingReasonData = get(response, "data.result", []);
        dispatch(
            setAllUnloadingReasonDetails({
                data: updatedUnloadingReasonData,
                update: true,
            })
        );
        const resData = response.data;
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(setUnloadingReasonError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
};

export const getUnloadingReasonById = async (uid: number) => {
    try {
        await axiosInstance
            .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
            .then((response) => {
                const currentUnloadingReasonData = get(response, "data.result", []);
                dispatch(setUnloadingReason(currentUnloadingReasonData));
            });
    } catch (error: ErrorType | any) {
        dispatch(
            setUnloadingReasonError(
                error.response.data?.details[0]?.description || serverDownErrorMessage
            )
        );
        throw new Error(error.response.data.details[0].description);
    }
};

export const createUnloadingReason = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
            data
        );
        const resData = response.data;
        dispatch(setUnloadingReasonMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(
            setUnloadingReasonError(
                error.response.data?.details[0]?.description || serverDownErrorMessage
            )
        );
        throw new Error(error.response.data.details[0].description);
    }
};

export const updateUnloadingReason = async (
    uid: number | undefined,
    data: FormValuesPropsUnloadingReason
) => {
    try {
        const response = await axiosInstance.put(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
            data
        );
        const resData = response.data;
        dispatch(setUnloadingReasonMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(
            setUnloadingReasonError(
                error.response.data?.details[0]?.description || serverDownErrorMessage
            )
        );
        throw new Error(error.response.data.details[0].description);
    }
};
