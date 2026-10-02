import { setActiveOutlets, setActiveRoutes, setDailyCollectionDetails, setDistributorView, setRepByDistri } from "@/redux/slices/report/daily-collection-report-slice";
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
        dispatch(setRepByDistri(repByDistri));
        return repByDistri;
    } catch (error) {
        dispatch(setRepByDistri([]));
        console.error("Error fetching representative:", error);
        throw new Error();
    }
};

export const getAllActiveRouteByRepID = async (distributorId: number, representativeId: number) => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}outlettransfer/getRouteAllByRepresentative?RepUId=${representativeId}&IsActive=true`
        );

        const activeRoutes = get(response, "data.OutletTransfer", []);
        dispatch(setActiveRoutes(activeRoutes));
        return activeRoutes;
    } catch (error) {
        dispatch(setActiveRoutes([]));
        console.error("Error fetching routes:", error);
        throw new Error();
    }
};

export const getAllActiveOutletsByRoute = async (
    routeId: number
) => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}routeoutlet/route?RouteUId=${routeId}&IsChecked=true&IsActive=true`
        );
        const itemsData = get(response, "data.result.items", []);
        dispatch(setActiveOutlets(itemsData));
        return itemsData;
    } catch (error) {
        dispatch(setActiveOutlets([]));
        console.error("Error fetching outlets:", error);
        throw new Error();
    }
};

export const getAllDailyCollectionReportDetails = async ({
    fromDate = "",
    toDate = "",
    tourTypes = [],
    distributorUIds = [],
    representativeUIds = [],
    routeUIds = [],
    outletUIds = [],
    offset = 1,
    count = 999999
} : {
    fromDate: string;
    toDate: string;
    tourTypes?: string[];
    distributorUIds?: number[];
    representativeUIds?: number[];
    routeUIds?: number[];
    outletUIds?: number[];
    offset?: number;
    count?: number;
}) => {
    try {
        const queryParams = new URLSearchParams({ FromDate: fromDate.toString(), ToDate: toDate.toString(), Offset: offset.toString(), Count: count.toString() });

        tourTypes.forEach(type => queryParams.append('tourTypes', type.toString()));
        distributorUIds.forEach(id => queryParams.append('distributorUIds', id.toString()));
        representativeUIds.forEach(id => queryParams.append('representativeUIds', id.toString()));
        routeUIds.forEach(id => queryParams.append('routeUIds', id.toString()));
        outletUIds.forEach(id => queryParams.append('outletUIds', id.toString()));

        const response = await axiosInstance.get(
            `${NEXT_PUBLIC_API_URL}${baseUrl}/dailyCollectionReport?${queryParams.toString()}`
        );

        const dailyCollectionReportDetails = get(response, "data.DailyCollectionReport", []);
        dispatch(setDailyCollectionDetails(dailyCollectionReportDetails));
        return dailyCollectionReportDetails;
    } catch (error) {
        dispatch(setDailyCollectionDetails([]));
        throw new Error();
    }
}