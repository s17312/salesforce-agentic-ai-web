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
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  dispatch(startLoading());
  try {
    const params = new URLSearchParams();

    if (page) params.append("page", page.toString());
    if (pageSize) params.append("pageSize", pageSize.toString());
    if (search) params.append("search", search);
    if (sortBy) params.append("sortColumn", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`
    );
    const vehicleDetails = get(response, "data.Vehicle", []);
    const paginationInfo = get(response, "data.paging", {});
    dispatch(setAllVehicleDetails(vehicleDetails));
    dispatch(setPaginationDetails(paginationInfo));
  } catch (error: ErrorType | any) {
    dispatch(setVehicleError(serverDownErrorMessage));
    throw new Error(error.response.data.details[0].description);
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
