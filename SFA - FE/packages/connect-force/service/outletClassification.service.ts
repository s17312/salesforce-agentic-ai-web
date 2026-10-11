import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllOutletClassifications,
  setPaginationDetails,
  setOutletClassification,
  setOutletClassificationError,
  setOutletClassificationMessage,
} from "@/redux/slices/outlet-classification-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { OutletClassificationPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "outletclassification";

export const getAllOutletClassifications = async (
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

    const response = await axiosInstance.get<OutletClassificationPagedResult>(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const outletclassificationData = get(
      response,
      "data.OutletClassification",
      get(response, "data.result", [])
    );
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllOutletClassifications(outletclassificationData));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: outletclassificationData,
      total: (paginationInfo as any)?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error) {
    dispatch(setOutletClassificationError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllActiveOutletClassifications = async () => {
  try {
    await axiosInstance
      .get<OutletClassificationPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true`
      )
      .then((response) => {
        const outletclassificationData = get(
          response,
          "data.OutletClassification",
          []
        );
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllOutletClassifications(outletclassificationData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setOutletClassificationError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getOutletClassificationById = async (uid: number) => {
  try {
    await axiosInstance
      .get<OutletClassificationPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`
      )
      .then((response) => {
        const curruntOutletClassificationData = get(
          response,
          "data.result",
          []
        );
        dispatch(setOutletClassification(curruntOutletClassificationData));
      });
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    dispatch(setOutletClassificationError(newError));
    throw new Error(newError);
  }
};

export const createOutletClassification = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setOutletClassificationMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    console.error(newError);
    dispatch(setOutletClassificationError(newError));
    throw new Error(newError);
  }
};

export const updateOutletClassification = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setOutletClassificationMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    console.error(newError);

    dispatch(setOutletClassificationError(newError));
    throw new Error(newError);
  }
};

export const updateOutletClassificationStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedOutletClassificationData = get(response, "data.result", []);
    dispatch(
      setAllOutletClassifications({
        data: updatedOutletClassificationData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    const newError = error.response.data.details[0].description;
    console.error(newError);
    dispatch(setOutletClassificationError(data.message));
    throw new Error(newError);
  }
};
