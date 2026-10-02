import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllProvinces,
  setPaginationDetails,
  setProvince,
  setProvinceError,
} from "@/redux/slices/province-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { ProvincePagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "province";

export const getAllProvinces = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<ProvincePagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}`)
      .then((response) => {
        const provinceData = get(response, "data.province", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllProvinces(provinceData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setProvinceError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getProvinceById = async (uid: number) => {
  try {
    await axiosInstance
      .get<ProvincePagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}`)
      .then((response) => {
        const provinceData = get(response, "data.district", []);
        dispatch(setProvince(provinceData));
      });
  } catch (error) {
    dispatch(setProvinceError(serverDownErrorMessage));
    throw new Error();
  }
};
