import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllCompanies,
  setCompany,
  setCompanyError,
  setCompanyMappingList,
  setCompanyMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/company-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { CompanyPagedResult } from "@/types/company-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "company";

export const getAllCompany = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const companyData = get(response, "data.Company", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllCompanies(companyData));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setCompanyError(serverDownErrorMessage));
  }
};

export const getCompanyById = async (id: number) => {
  dispatch(startLoading());
  try {
    await axiosInstance
      .get<CompanyPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${id}`)
      .then((response) => {
        const companyData = get(response, "data.result", []);
        dispatch(setCompany(companyData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setCompanyError(serverDownErrorMessage));
  }
};

export const createCompany = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setCompanyMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setCompanyError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateCompany = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setCompanyMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setCompanyError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateCompanyStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updateCompanyData = get(response, "data.result", []);
    dispatch(setAllCompanies({ data: updateCompanyData, update: true }));
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setCompanyError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getCompanyMapping = async () => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/mappinglist`)
      .then((response) => {
        const companyMappingData = get(response, "data.result.companyMappingList", []);
        dispatch(setCompanyMappingList(companyMappingData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
}
