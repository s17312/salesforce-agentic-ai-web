import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllDistributors,
  setDistributor,
  setDistributorError,
  setDistributorMapping,
  setDistributorMessage,
  setPaginationDetails,
  startLoading,
} from "@/redux/slices/distributor-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { DistributorPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributor";

export const createDistributor = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/create`,
      data
    );
    const resData = response.data;
    dispatch(setDistributorMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDistributorError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllDistributors = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  isActive?: boolean
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (isActive !== undefined) params.append("IsActive", isActive.toString());
    await axiosInstance
      .get<DistributorPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
      )
      .then((response) => {
        const distributionData = get(response, "data.Distributor", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllDistributors(distributionData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error: ErrorType | any) {
    dispatch(setDistributorError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const getDistributorById = async (uid: number) => {
  dispatch(startLoading());
  try {
    await axiosInstance
      .get<DistributorPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const curruntDistributorData = get(response, "data.result", []);
        dispatch(setDistributor(curruntDistributorData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setDistributorError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateDistributor = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setDistributorMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDistributorError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

//patch for active inactive
export const updateDistributorStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updateDistributorData = get(response, "data.result", []);
    dispatch(setAllDistributors({ data: updateDistributorData, update: true }));
    const resData = response.data;

    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setDistributorError(
        error.response.data.details[0].description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

//DISTRIBUTOR MAPPING
export const getDistributorMapping = async () => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/mapping`)
      .then((response) => {
        const distributorMappingData = get(response, "data.result.distributorMappingList", []);
        dispatch(setDistributorMapping(distributorMappingData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
