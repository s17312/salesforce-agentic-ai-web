import {
  setCompaniesDistributor,
  setCompanyDistributorsIsTrue,
  setDistributorCompanies,
  setDistributorCompaniesIsTrue,
  setDistributorCompaniesMsg,
} from "@/redux/slices/mappers/distributor-company-slice";
import { dispatch } from "@/redux/store";
import { ErrorType } from "@/types/common-types";
import { CompaniesByDistributorIdPagedResults } from "@/types/mapping-types/distributor-company-types";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "companydistributor";

// distributor --------> company mapping

export const getAllCompaniesByDistributorId = async (uid: number) => {
  try {
    await axiosInstance
      .get<CompaniesByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/company?DistributorId=${uid}&IsActive=true`
      )
      .then((response) => {
        const companyData = get(response, "data.result.items", []);
        dispatch(setCompaniesDistributor(companyData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllCompaniesByDistributorIdIsChecked = async (uid: number) => {
  try {
    await axiosInstance
      .get<CompaniesByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/distributor/${uid}?isChecked=true`
      )
      .then((response) => {
        const companyData = get(response, "data.result.items", []);

        dispatch(setCompanyDistributorsIsTrue(companyData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const distributorCompanyBulkUpdate = async (
  uid: number,
  data: any[]
) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/${uid}`, data)
      .then((response) => {
        const responceMsg = get(response, "data.message", []);
        dispatch(setDistributorCompaniesMsg(responceMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

// company ---------> distributor mapping

export const getAllDistributorsByCompanyId = async (uid: number) => {
  try {
    await axiosInstance
      .get<CompaniesByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/distributorDetails/company?CompanyId=${uid}`
      )
      .then((response) => {
        const companyData = get(response, "data.result.items", []);
        dispatch(setDistributorCompanies(companyData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const getAllDistributorsByCompanyIdIsChecked = async (uid: number) => {
  try {
    await axiosInstance
      .get<CompaniesByDistributorIdPagedResults>(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/distributorDetails/company?CompanyId=${uid}&isChecked=true`
      )
      .then((response) => {
        const companyData = get(response, "data.result.items", []);

        dispatch(setDistributorCompaniesIsTrue(companyData));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};

export const companyDistributorBulkUpdate = async (
  uid: number,
  data: any[]
) => {
  try {
    await axiosInstance
      .put(`${NEXT_PUBLIC_API_URL}${baseUrl}/bulkupdate/company/${uid}`, data)
      .then((response) => {
        const responseMsg = get(response, "data.message", []);
        dispatch(setDistributorCompaniesMsg(responseMsg));
      });
  } catch (error: ErrorType | any) {
    throw new Error(error.response.data.details[0].description);
  }
};
