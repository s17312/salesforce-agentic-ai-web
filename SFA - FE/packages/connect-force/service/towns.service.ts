import { serverDownErrorMessage } from "@/data/common-errors";
import {
  setAllTowns,
  setPaginationDetails,
  setTownError,
} from "@/redux/slices/town-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { CityPagedResult } from "connect-force-api-client";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "city";
const baseDistrictCityUrl = "city/districtby"; //${NEXT_PUBLIC_API_URL}${baseUrl}/${uid}

export const getAllTowns = async (
  page?: number,
  pageSize?: number,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  try {
    await axiosInstance
      .get<CityPagedResult>(`${NEXT_PUBLIC_API_URL}${baseUrl}`)
      .then((response) => {
        const cityData = get(response, "data.city", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllTowns(cityData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setTownError(serverDownErrorMessage));
    throw new Error();
  }
};

export const getAllTownsByDistrict = async (uid: number) => {
  try {
    await axiosInstance
      .get<CityPagedResult>(
        `${NEXT_PUBLIC_API_URL}${baseDistrictCityUrl}${uid}`
      )
      .then((response) => {
        const cityData = get(response, "data.result", []);
        const paginationInfo = get(response, "data.paging", {});
        dispatch(setAllTowns(cityData));
        dispatch(setPaginationDetails(paginationInfo));
      });
  } catch (error) {
    dispatch(setTownError(serverDownErrorMessage));
    throw new Error();
  }
};
