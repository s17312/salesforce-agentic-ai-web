import { serverDownErrorMessage } from "@/data/common-errors";
import { setPaginationDetails } from "@/redux/slices/business-category-slice";
import {
  setAllOutletCategories,
  setOutletCategory,
  setOutletCategoryError,
} from "@/redux/slices/outlet-category-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletCategoryPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "outletcategory";

export const getAllOutletCategories = async (
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

    const response = await axiosInstance.get<OutletCategoryPagedResult>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const outletCategoryData = get(response, "data.OutletCategory", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllOutletCategories(outletCategoryData));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: outletCategoryData,
      total: (paginationInfo as any)?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveOutletCategories = async () => {
  try {
    await axiosInstance
      .get<OutletCategoryPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const outletCategoryData = get(response, "data.OutletCategory", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutletCategories(outletCategoryData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    throw new Error();
  }
};

export const createOutletCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const getOutletCategoryById = async (uid: number) => {
  try {
    await axiosInstance
      .get<OutletCategoryPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntOutletCategoryData = get(response, "data.result", []);
        dispatch(setOutletCategory(curruntOutletCategoryData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const updateOutletCategory = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    const newError = error.response.data.details[0].description;
    throw new Error(newError);
  }
};

export const updateOutletCategoryStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updateOutletCategoryStatusData = get(response, "data.result", []);

    dispatch(
      setAllOutletCategories({
        data: updateOutletCategoryStatusData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setOutletCategoryError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
