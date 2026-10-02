import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllDistricts,
  setPaginationDetails,
  setDistrictError,
} from "@/redux/slices/district-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { DistrictPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "district"; //district/provinceby

export const getAllDistricts = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<DistrictPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}`)
      .then((response) => {
        const districtData = get(response, "data.district", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllDistricts(districtData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setDistrictError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllDistrictsByProvince = async (uid: number) => {
  try {
    await axiosInstance
      .get<DistrictPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/provinceby${uid}`
      )
      .then((response) => {
        const districtData = get(response, "data.result", []);
        // const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllDistricts(districtData));
        // dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setDistrictError(serverDownErrorMessage));
    throw new Error();
  }
};
