import { serverDownErrorMessage } from "@/data/common-errors";
import { startLoading } from "@/redux/slices/business-category-slice";
import { ErrorType } from "@/types/common-types";
import {
  setAllTitles,
  setPaginationDetails,
  setTitle,
  setTitleError,
} from "@/redux/slices/title-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { TitlePagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "title";

export const getTitleById = async (uid: number) => {
  try {
    await axiosInstance
      .get<TitlePagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntTitleData = get(response, "data.result", []);
        dispatch(setTitle(curruntTitleData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setTitleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createTitle = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setTitleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllTitles = async (
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

    const response = await axiosInstance.get<TitlePagedResult>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const titleData = get(response, "data.title", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllTitles(titleData));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: titleData,
      total: (paginationInfo as any)?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error) {
    dispatch(setTitleError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveTitles = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    dispatch(startLoading());
    await axiosInstance
      .get<TitlePagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`)
      .then((response) => {
        const titleData = get(response, "data.title", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllTitles(titleData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setTitleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateTitle = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setTitleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateTitleStatus = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedTitleData = get(response, "data.result", []);
    dispatch(setAllTitles({ data: updatedTitleData, update: true }));
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    console.error(error.response.data.details[0].description);
    dispatch(setTitleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
