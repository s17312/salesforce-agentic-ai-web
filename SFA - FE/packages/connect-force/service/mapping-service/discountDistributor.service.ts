import { setDistributorMessage } from "@/redux/slices/distributor-slice";
import { setDiscountDistributorsIsTrue } from "@/redux/slices/mappers/discount-distributor-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "discountdistributor";

// discount -> distributor assign Mapping
export const assignDiscountDistributorMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(`${NEXT_PUBLIC_API_URL}${baseUrl}/create`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setDistributorMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// discount -> distributor unassign Mapping
export const unassignDiscountDistributorMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/update`, data)
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setDistributorMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllDistributorsByDiscountIdIsTrue = async (uid: number) => {
  try {
    await axiosInstance
      .get<any>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?IsActive=true&DiscountUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const distributorListData = get(response, "data.Distributors", []);
        dispatch(setDiscountDistributorsIsTrue(distributorListData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
