import { setDistributorView, setItemWiseDetails, setRepBydistri } from "@/redux/slices/report/item-wise-sales-summary-report-slice";
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

export const getAllActiveRepByDistriID = async (distributorId: number) => {
  try {
    const response = await axiosInstance.get<any>(
      `${NEXT_PUBLIC_API_URL}outlettransfer/getRepresentativeAllByDistributor?DistributorUId=${distributorId}&IsActive=true`
    );

    const repByDistri = get(response, "data.OutletTransfer", []);
    dispatch(setRepBydistri(repByDistri));
    return repByDistri;
  } catch (error) {
    dispatch(setRepBydistri([]));
    console.error("Error fetching representative:", error);
    throw new Error();
  }
};

export const getItemWiseSummaryDetails = async ({
  fromDate = "",
  toDate = "",
  distributorUIds = [],
  representativeUIds = [],
  productUIds = [],
}: {
  fromDate: string;
  toDate: string;
  distributorUIds?: number[];
  representativeUIds?: number[];
  productUIds?: number[];
}) => {
  try {
    const queryParams = new URLSearchParams({ FromDate: fromDate.toString(), ToDate: toDate.toString() });
    distributorUIds = distributorUIds.flat();
    representativeUIds = representativeUIds.flat();
    productUIds = productUIds.flat();

    const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/itemWiseSalesSummaryReport?${queryParams.toString()}`
      + `${distributorUIds.length ? `&distributorUIds=${distributorUIds.join("&distributorUIds=")}` : ""}`
      + `${representativeUIds.length ? `&representativeUIds=${representativeUIds.join("&representativeUIds=")}` : ""}`
      + `${productUIds.length ? `&ProductUIds=${productUIds.join("&ProductUIds=")}` : ""}`
    const response = await axiosInstance.get(url);

    const itemWiseSummaryDetails = get(response, "data.ItemWiseSalesSummaryReport", []);
    dispatch(setItemWiseDetails(itemWiseSummaryDetails));
    return itemWiseSummaryDetails;
  } catch (error) {
    dispatch(setItemWiseDetails([]));
    throw new Error();
  }
};