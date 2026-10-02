import { setDistributorView, setPOGRNSummaryDetails, setPriceListView } from "@/redux/slices/report/po-grn-summary-report-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "report";

export const getDistributorsByCompanyUId = async (id: number) => {
    try {
        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}companydistributor/distributorDetails/company?CompanyId=${id}&IsChecked=true&IsActive=true`
        );
        const currentDistributors = get(response, "data.result.items", []);
        dispatch(setDistributorView(currentDistributors));
        return currentDistributors;
    } catch (error) {
        dispatch(setDistributorView([]));
        throw new Error();
    }
};

// GET /getPriceList/{distributorId}
export const getPriceListsById = async (distributorId: number) => {
  try {
    const response = await axiosInstance.get(
      `${NEXT_PUBLIC_API_URL}distributorStockAdjustment/getPriceList/${distributorId}`
    );
    dispatch(setPriceListView(get(response, "data", [])));
    return get(response, "data", []);
  } catch (error) {
    throw new Error();
  }
};

export const getAllPOGRNReportDetails = async ({
    fromDate = "",
    toDate = "",
    companyUId = 0,
    distributorUId = 0,
    priceListTypeUId = 0,
    offset = 1,
    count = 999999
} : {
    fromDate: string;
    toDate: string;
    companyUId?: number;
    distributorUId?: number;
    priceListTypeUId?: number;
    offset?: number;
    count?: number;
}) => {
    try {
        const queryParams = new URLSearchParams({ FromDate: fromDate.toString(), ToDate: toDate.toString(), Offset: offset.toString(), Count: count.toString() });

        if (companyUId && companyUId !== 0) {
            queryParams.append("CompanyUId", companyUId.toString());
        }
        if (distributorUId && distributorUId !== 0) {
            queryParams.append("DistributorUId", distributorUId.toString());
        }
        if (priceListTypeUId && priceListTypeUId !== 0) {
            queryParams.append("PriceListTypeUId", priceListTypeUId.toString());
        }

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/poGRNSummaryReport?${queryParams.toString()}`
        );

        const poGRNSummaryReportDetails = get(response, "data.POGRNSummaryReport", []);
        dispatch(setPOGRNSummaryDetails(poGRNSummaryReportDetails));
        return poGRNSummaryReportDetails;
    } catch (error) {
        dispatch(setPOGRNSummaryDetails([]));
        throw new Error();
    }
}


