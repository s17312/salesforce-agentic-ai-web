import { serverDownErrorMessage } from "@/data/common-errors";
import { setAllBaseUnitTypeDetails, setAllSalesUnitTypeDetails, setPaginationDetails, setSalesUnitType, setSalesUnitTypeError, setSalesUnitTypeMessage, startLoading } from "@/redux/slices/sales-unit-type-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { FormValuesPropsSalesUnitType } from "@/types/sales-unit-type-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "salesunittype";

export const getAllSalesUnitTypeDetails = async (
    pageOrParams?:
        | number
        | {
            page?: number;
            pageSize?: number;
            searchKeyword?: string;
            sortColumn?: string;
            sortOrder?: string;
            isActive?: boolean | string;
            isArchive?: boolean;
            isBaseUnit?: boolean;
        },
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean,
    isBaseUnit?: boolean
) => {
    dispatch(startLoading());
    try {
        const params = new URLSearchParams();
        let pageNum = 1;
        let sizeNum = 100;
        let searchVal = "";
        let sortCol = "";
        let sortOrd = "";

        if (typeof pageOrParams === "object" && pageOrParams !== null) {
            pageNum = pageOrParams.page ?? 1;
            sizeNum = pageOrParams.pageSize ?? 10;
            searchVal = pageOrParams.searchKeyword || "";
            sortCol = pageOrParams.sortColumn || "";
            sortOrd = pageOrParams.sortOrder || "";
            if (pageOrParams.isActive !== undefined && pageOrParams.isActive !== "") {
                params.append("IsActive", String(pageOrParams.isActive));
            }
            if (pageOrParams.isArchive !== undefined) {
                params.append("IsArchive", String(pageOrParams.isArchive));
            }
            if (pageOrParams.isBaseUnit !== undefined) {
                params.append("IsBaseUnit", String(pageOrParams.isBaseUnit));
            }
        } else {
            if (pageOrParams) pageNum = pageOrParams;
            if (pageSize) sizeNum = pageSize;
            if (searchKeyword) searchVal = searchKeyword;
            if (sortBy) sortCol = sortBy;
            if (sortOrder) sortOrd = sortOrder;
            if (isActive !== undefined) params.append("IsActive", isActive.toString());
            if (isArchive !== undefined) params.append("IsArchive", isArchive.toString());
            if (isBaseUnit !== undefined) params.append("IsBaseUnit", isBaseUnit.toString());
        }

        if (pageNum) params.append("page", pageNum.toString());
        if (sizeNum) params.append("pageSize", sizeNum.toString());
        if (searchVal) params.append("searchKeyword", searchVal);
        if (sortCol) params.append("sortColumn", sortCol);
        if (sortOrd) params.append("sortOrder", sortOrd);

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
        );
        const salesUnitTypeDetails = get(response, "data.SalesUnitType", get(response, "data.result", []));
        const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
        dispatch(setAllSalesUnitTypeDetails(salesUnitTypeDetails));
        dispatch(setPaginationDetails(paginationInfo));
        return {
            data: salesUnitTypeDetails,
            total: paginationInfo?.total ?? 0,
            paging: paginationInfo,
        };
    } catch (error: ErrorType | any) {
        dispatch(setSalesUnitTypeError(serverDownErrorMessage));
        throw new Error(error?.response?.data?.details?.[0]?.description || serverDownErrorMessage);
    }
}

export const getAllBaseUnitTypeDetails = async (
    page?: number,
    pageSize?: number,
    searchKeyword?: string,
    sortBy?: string,
    sortOrder?: string,
    isActive?: boolean,
    isArchive?: boolean,
    isBaseUnit?: boolean
) => {
    dispatch(startLoading());
    try {
        const params = new URLSearchParams();

        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (searchKeyword) params.append("searchKeyword", searchKeyword);
        if (sortBy) params.append("sortColumn", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        if (isActive == undefined) params.append("IsActive", true.toString());
        if (isArchive == undefined)
            params.append("IsArchive", false.toString());
        if (isBaseUnit == undefined) params.append("IsBaseUnit", true.toString());

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
        );
        const baseUnitTypeDetails = get(response, "data.SalesUnitType", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllBaseUnitTypeDetails(baseUnitTypeDetails));
        dispatch(setPaginationDetails(paginationInfo));
    } catch (error: ErrorType | any) {
        dispatch(setSalesUnitTypeError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
}

export const updateSalesUnitTypeStatus = async (
    uid: number | undefined,
    data: any
) => {
    try {
        const response = await axiosInstance.patch(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
            data
        );
        const salesUnitTypeDetails = get(response, "data.result", []);
        dispatch(setAllSalesUnitTypeDetails({ data: salesUnitTypeDetails, update: true }));
        const resData = response.data;
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(setSalesUnitTypeError(serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
}

export const getSalesUnitTypeById = async (uid: number) => {
    try {
        const response = await axiosInstance.get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`);
        const salesUnitType = get(response, "data.result", []);
        dispatch(setSalesUnitType(salesUnitType));
        return salesUnitType;
    } catch (error: ErrorType | any) {
        dispatch(setSalesUnitTypeError(error.response.data?.details[0]?.description || serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
}

export const createSalesUnitType = async (data: any) => {
    try {
        const response = await axiosInstance.post(`${NEXT_PUBLIC_API_URL}${baseUrl}/create`, data);
        const resData = response.data;
        dispatch(setSalesUnitTypeMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(setSalesUnitTypeError(error.response.data?.details[0]?.description || serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
}

export const updateSalesUnitType = async (uid: number | undefined, data: FormValuesPropsSalesUnitType) => {
    try {
        const response = await axiosInstance.put(`${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`, data);
        const resData = response.data;
        dispatch(setSalesUnitTypeMessage(resData.message));
        return resData.data;
    } catch (error: ErrorType | any) {
        dispatch(setSalesUnitTypeError(error.response.data?.details[0]?.description || serverDownErrorMessage));
        throw new Error(error.response.data.details[0].description);
    }
}