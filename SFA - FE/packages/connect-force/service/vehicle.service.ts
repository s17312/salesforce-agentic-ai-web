import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllVehicleDetails,
  setDistributorDetails,
  setPaginationDetails,
  setRepresentativeDetails,
  setVehicle,
  setVehicleError,
  setVehicleMessage,
  startLoading,
} from "@/redux/slices/vehicle-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "vehicle";

export const getAllVehicleDetails = async (
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

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const vehicleDetails = get(response, "data.Vehicle", get(response, "data.result", []));
    const paginationInfo = get(response, "data.pagingView", get(response, "data.paging", {}));
    dispatch(setAllVehicleDetails(vehicleDetails));
    dispatch(setPaginationDetails(paginationInfo));
    return {
      data: vehicleDetails,
      total: paginationInfo?.total ?? 0,
      paging: paginationInfo,
    };
  } catch (error: ErrorType | any) {
    dispatch(setVehicleError(serverDownErrorMessage));
    throw new Error(error?.response?.data?.details?.[0]?.description || serverDownErrorMessage);
  }
};

export const updateVehicleStatus = async (
  uid: number | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.patch(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const updatedVehicleData = get(response, "data.result", []);
    dispatch(
      setAllVehicleDetails({
        data: updatedVehicleData,
        update: true,
      })
    );
    const resData = response.data;
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(setVehicleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

export const createVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      `${NEXT_PUBLIC_API_URL}${baseUrl}`,
      data
    );
    const resData = response.data;
    dispatch(setVehicleMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setVehicleError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const updateVehicle = async (uid: number | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(
      `${NEXT_PUBLIC_API_URL}${baseUrl}/update/${uid}`,
      data
    );
    const resData = response.data;
    dispatch(setVehicleMessage(resData.message));
    return resData.data;
  } catch (error: ErrorType | any) {
    dispatch(
      setVehicleError(
        error.response.data?.details[0]?.description || serverDownErrorMessage
      )
    );
    throw new Error(error.response.data.details[0].description);
  }
};

export const getVehicleById = async (uid: number) => {
  try {
    await axiosInstance
      .get(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const currentVehicleData = get(response, "data.result", []);
        dispatch(setVehicle(currentVehicleData));
      });
  } catch (error: ErrorType | any) {
    dispatch(setVehicleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
  }
};

//Vehicle Assingment Service
export const getAllActiveDistributorsAssignment = async () => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}outlettransfer/getDistributorAll?IsActive=true`
    );
    const distributorData = get(response, "data.OutletTransfer", []);
    dispatch(setDistributorDetails(distributorData));
    return distributorData;
  } catch (error) {
    console.error("Error fetching distributors:", error);
    throw new Error();
  }
};

export const getAllRepByDistriIDAssignment = async (uid: number) => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}outlettransfer/getRepresentativeAllByDistributor?DistributorUId=${uid}&IsActive=true`
    );
    const outletRepByDistri = get(response, "data.OutletTransfer", []);
    dispatch(setRepresentativeDetails(outletRepByDistri));
    return outletRepByDistri;
  } catch (error) {
    console.error("Error fetching representative:", error);
    throw new Error();
  }
};
