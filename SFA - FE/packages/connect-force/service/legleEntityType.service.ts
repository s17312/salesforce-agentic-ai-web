import { LegalEntryTypePagedResult } from "connect-force-api-client/models/legal-entry-type-paged-result";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";
import { dispatch } from "@/redux/store";
import {
  setAllLegleEntityTypes,
  setLegleEntityType,
  setLegleEntityTypeError,
  setLegleEntityTypeMessage,
  setPaginationDetails,
} from "@/redux/slices/legle-entity-type-slice";
import { serverDownErrorMessage } from "@/data/common-errors";
import { ErrorType } from "@/types/common-types";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "legalentitype";

export const getAllLegaleEntityTypes = async (
  pageOrParams?:
    | number
    | {
        page?: number;
        pageSize?: number;
        searchKeyword?: string;
        sortColumn?: string;
        sortOrder?: string;
        isActive?: boolean | string;
      },
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    const params = new URLSearchParams();
    let pageNum = 1;
    let sizeNum = 100;
    let searchVal = "";
    let sortCol = "uId";
    let sortOrd = "desc";

    if (typeof pageOrParams === "object" && pageOrParams !== null) {
      pageNum = pageOrParams.page ?? 1;
      sizeNum = pageOrParams.pageSize ?? 10;
      searchVal = pageOrParams.searchKeyword || "";
      sortCol = pageOrParams.sortColumn || "uId";
      sortOrd = pageOrParams.sortOrder || "desc";
      if (pageOrParams.isActive !== undefined && pageOrParams.isActive !== "") {
        params.append("IsActive", String(pageOrParams.isActive));
      }
    } else {
      if (pageOrParams) pageNum = pageOrParams;
      if (pageSize) sizeNum = pageSize;
      if (search) searchVal = search;
      if (sortBy) sortCol = sortBy;
      if (sortOrder) sortOrd = sortOrder;
    }

    if (pageNum) params.append("page", pageNum.toString());
    if (sizeNum) params.append("pageSize", sizeNum.toString());
    if (searchVal) params.append("searchKeyword", searchVal);
    if (sortCol) params.append("sortColumn", sortCol);
    if (sortOrd) params.append("sortOrder", sortOrd);

    const response = await axiosInstance.get<LegalEntryTypePagedResult>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const legalEntityTypeData = get(response, "data.LegalEntryType", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllLegleEntityTypes(legalEntityTypeData));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: legalEntityTypeData,
      total: (paginationInfo as any)?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error) {
    dispatch(setLegleEntityTypeError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveLegaleEntityTypes = async (
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
    const companyData = get(response, "data.LegalEntryType", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllLegleEntityTypes(companyData));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setLegleEntityTypeError(serverDownErrorMessage));
  }
};

export const createLegleEntityType = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setLegleEntityTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setLegleEntityTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getLegleEntityTypeById = async (uid: number) => {
  try {
    await axiosInstance
      .get<LegalEntryTypePagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntLegleEntityTypeData = get(response, "data.result", []);
        dispatch(setLegleEntityType(curruntLegleEntityTypeData));
      });
  } catch (error: ErrorType | any) {
    dispatch(
      setLegleEntityTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateLegleEntityType = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setLegleEntityTypeMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setLegleEntityTypeError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateLegleEntityTypeStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedLegleEntityTypeData = get(response, "data.result", []);
    dispatch(
      setAllLegleEntityTypes({ data: updatedLegleEntityTypeData, update: true })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setLegleEntityTypeError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
