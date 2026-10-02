import {
  setAssignedOutlet,
  setRepresentativeOutletsMsg,
} from "@/redux/slices/mappers/representative-outlet";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { OutletsByRepresentativeIdPagedResults } from "@/types/mapping-types/representative-outlet-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "representativeoutlet";

// Representative -> Outlet assign Mapping
export const assignRepresentativeOutletMapping = async (data: any) => {
  try {
    await axiosInstance
      .post(`${NEXT_PUBLIC_API_URL}${baseUrl}/create`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setRepresentativeOutletsMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Representative -> Outlet unassign Mapping
export const unassignRepresentativeOutletMapping = async (data: any) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/update`, data)
      .then((responce) => {
        const responceMsg = get(responce, "data.message", []);
        dispatch(setRepresentativeOutletsMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// Get All Outlet By Representative Id
export const getAllOutletByRepresentativeId = async (uid: number) => {
  try {
    await axiosInstance
      .get<OutletsByRepresentativeIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}?RepresentativeUId=${uid}&IsChecked=true`
      )
      .then((response) => {
        const outletData = get(response, "data.Outlets", []);
        dispatch(setAssignedOutlet(outletData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
