import { serverDownErrorMessage } from "@/data/common-errors";
import { setAllReturnReasonDetails, setPaginationDetails, setReturnReason, setReturnReasonError, setReturnReasonMessage, startLoading } from "@/redux/slices/return-reason-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsReturnReason } from "@/types/return-reason-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "returnreason";

export const getAllReturnReasonDetails = async (
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
        if (isArchive !== undefined) params.append("IsArchive", isArchive.toString());

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
        );
        const returnReasonDetails = get(response, "data.ReturnReason", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllReturnReasonDetails(returnReasonDetails));
        dispatch(setPaginationDetails(paginationInfo));
    } catch (error: ErrorType | any) {
        dispatch(setReturnReasonError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);

    }
};

export const createReturnReason = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
            data
        );
        const resData = response.data;
        dispatch(setReturnReasonMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(setReturnReasonError(error.response.data?.details[0]?.description || serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);

    }
};

export const updateReturnReasonStatus = async (
    uid: number | undefined,
    data: any
) => {
    try {
        const response = await axiosInstance.patch(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
            data
        );
        const updatedreturnReasionData = get(response, "data.result", []);
        dispatch(
            setAllReturnReasonDetails({
                data: updatedreturnReasionData,
                update: true,
            })
        );
        const resData = response.data;
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(setReturnReasonError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
};

export const updateReturnReason = async (
    uid: number | undefined,
    data: FormValuesPropsReturnReason
) => {
    try {
        const response = await axiosInstance.put(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
            data
        );
        const resData = response.data;
        dispatch(setReturnReasonMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(
            setReturnReasonError(
                error.response.data?.details[0]?.description || serverDownErrorMessage
            )
        );
        throw new Error(error.response.data.details[0].description);
    }
};

export const getReturnReasonById = async (uid: number) => {
    try {
      await axiosInstance
        .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
        .then((response) => {
          const currentReturnReasonData = get(response, "data.result", []);
          dispatch(setReturnReason(currentReturnReasonData));
        });
    } catch (error: ErrorType | any) {
      dispatch(
        setReturnReasonError(
          error.response.data?.details[0]?.description || serverDownErrorMessage
        )
      );
      throw new Error(error.response.data.details[0].description);
    }
  };