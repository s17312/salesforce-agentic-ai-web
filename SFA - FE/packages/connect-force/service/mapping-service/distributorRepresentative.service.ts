import {
  setDistributorRepresentativeMsg,
  setDistributorRepresentatives,
  setDistributorRepresentativesIsTrue,
} from "@/redux/slices/mappers/distributor-representative-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { ProductsByDistributorIdPagedResults } from "@/types/mapping-types/distributor-product-types";
import { RepresentativesByDistributorIdPagedResults } from "@/types/mapping-types/distributor-representative-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "distributorrepresentative";

// Distributor -> Representatives Mapping view by distributor Uid
export const getAllRepresentativesByDistributorId = async (uid: number) => {
  try {
    await axiosInstance
      .get<ProductsByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/representativeDetails/Distributor?DistributorUId=${uid}&IsActive=true`
      )
      .then((response) => {
        const representativeData = get(response, "data.result.items", []);
        dispatch(setDistributorRepresentatives(representativeData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Distributor -> Representatives Mapping assined view by distributor Uid
export const getAllRepresentativesByDistributorIdIsChecked = async (
  uid: number
) => {
  try {
    await axiosInstance
      .get<RepresentativesByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/representativeDetails/Distributor?DistributorUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const representativeData = get(response, "data.result.items", []);
        dispatch(setDistributorRepresentativesIsTrue(representativeData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

//Distributor -> Representatives Mapping update
export const distributorRepresentativeBulkUpdate = async (
  uid: number,
  data: any
) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/${uid}`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setDistributorRepresentativeMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
