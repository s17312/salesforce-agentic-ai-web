import { setCompanyMessage } from "@/redux/slices/company-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "companyproduct";

// Product -> Company assign Mapping
export const assignProductCompanyMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/create/bulkproductcompany`,
        data
      )
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setCompanyMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Product -> Company unassign Mapping
export const unassignProductCompanyMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/update/bulkproductcompany`,
        data
      )
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setCompanyMessage(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
