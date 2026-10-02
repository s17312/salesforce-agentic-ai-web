import { setDistributorSalesDetails, setDistributorView, setRepBydistri } from "@/redux/slices/report/distributor-sales-report-slice";
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

export const getAllDistributorSalesReportDetails = async ({
    fromDate = "",
    toDate = "",
    tourTypes = [],
    distributorUIds = [],
    representativeUIds = [],
    offset = 1,
    count = 999999
}: {
    fromDate: string;
    toDate: string;
    tourTypes?: string[];
    distributorUIds?: number[];
    representativeUIds?: number[];
    offset?: number;
    count?: number;
}) => {
    try {
        const queryParams = new URLSearchParams({ FromDate: fromDate.toString(), ToDate: toDate.toString(), Offset: offset.toString(), Count: count.toString() });

        tourTypes = tourTypes.flat();
        distributorUIds = distributorUIds.flat();
        representativeUIds = representativeUIds.flat();

        const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/distributorSalesReport?${queryParams.toString()}`
            + `${tourTypes.length ? `&tourTypes=${tourTypes.join("&tourTypes=")}` : ""}`
            + `${distributorUIds.length ? `&distributorUIds=${distributorUIds.join("&distributorUIds=")}` : ""}`
            + `${representativeUIds.length ? `&representativeUIds=${representativeUIds.join("&representativeUIds=")}` : ""}`;
        const response = await axiosInstance.get(url);

        const setDistributorSalesDetail = get(response, "data.DistributorSalesReport", []);

        dispatch(setDistributorSalesDetails(setDistributorSalesDetail));
        return setDistributorSalesDetail;
    } catch (error) {
        dispatch(setDistributorSalesDetails([]));
        throw new Error();
    }
};