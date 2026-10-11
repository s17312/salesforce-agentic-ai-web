import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllProductGroups,
  setPaginationDetails,
  setProductGroup,
  setProductGroupError,
  setProductGroupMessage,
} from "@/redux/slices/product-group-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { ProductGroupPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "productgroup";

export const getAllProductGroups = async (
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

    const response = await axiosInstance.get<ProductGroupPagedResult>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const productGroupData = get(response, "data.ProductGroup", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllProductGroups(productGroupData));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: productGroupData,
      total: (paginationInfo as any)?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error();
  }
};
export const getAllActiveProductGroups = async () => {
  try {
    await axiosInstance
      .get<ProductGroupPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const productGroupData = get(response, "data.ProductGroup", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllProductGroups(productGroupData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error();
  }
};
export const createProductGroup = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setProductGroupMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductGroupError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getProductGroupById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentProductGroup = get(response, "data.result", []);
        dispatch(setProductGroup(currentProductGroup));
      });
  } catch (error: TypeError | any) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateProductGroup = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setProductGroupMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setProductGroupError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new error(error.response.data.details[0].description);
  }
};

export const updateProductGroupStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedProductGroupData = get(response, "data.result", []);
    dispatch(
      setAllProductGroups({ data: updatedProductGroupData, update: true })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setProductGroupError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};
