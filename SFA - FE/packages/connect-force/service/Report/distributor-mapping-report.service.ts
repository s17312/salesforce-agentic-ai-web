import { setDistributors } from "@/redux/slices/outlet-transfer-slice";
import { setActiveDistributors, setDistributorMappingReport } from "@/redux/slices/report/distributor-mapping-report-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "mappingReport";

interface GetMappingReportParams {
    mappingItems?: string;
    distributorUIds?: number[];
    offset?: number;
    count?: number;
}

export const getDistributorMappingReport = async ({
    mappingItems,
    distributorUIds,
    offset = 1,
    count = 999999,
}: GetMappingReportParams) => {
    try {
        const queryParams = new URLSearchParams({
            Offset: offset.toString(),
            Count: count.toString(),
        });
        distributorUIds = distributorUIds?.flat();

        if (mappingItems) queryParams.append("MappingItems", mappingItems);

        const url = `${NEXT_PUBLIC_API_URL}${baseUrl}/distributor?${queryParams.toString()}`
            + `${distributorUIds?.length ? `&DistributorUIds=${distributorUIds.join("&DistributorUIds=")}` : ""}`;
        const response = await axiosInstance.get(url);

        const distributorMappingReport = get(response, "data.DistributorMappingDetail", []);
        dispatch(setDistributorMappingReport(distributorMappingReport));
    } catch (error) {
        console.error("Error fetching distributor mapping report:", error);
        dispatch(setDistributorMappingReport([]));
        throw new Error("Failed to fetch distributor mapping report");
    }
};

export const getAllActiveDistributors = async () => {
    try {
        const response = await axiosInstance.get<any>(
            `${NEXT_PUBLIC_API_URL}outlettransfer/getDistributorAll?IsActive=true`
        );
        const distributorData = get(response, "data.OutletTransfer", []);
        dispatch(setActiveDistributors(distributorData));
    } catch (error) {
        console.error("Error fetching distributors:", error);
        throw new Error();
    }
};
