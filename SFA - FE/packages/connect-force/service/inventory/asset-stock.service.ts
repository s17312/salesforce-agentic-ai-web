import { setAssetStock } from "@/redux/slices/asset-stock-slice";
import { dispatch } from "@/redux/store";
import axiosInstance from "@/utils/axios";
import { get } from "lodash";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = "currentStock";

interface GetAssetStockParams {
    assignStatus?: number;
    assetTypeUIds?: number[];
    assetModelUIds?: number[];
    assetBrandUIds?: number[];
    allocationTypeUIds?: number[];
    distributorUIds?: number[];
    outletUIds?: number[];
    repairCenterUIds?: number[];
    disposalCenterUIds?: number[];
    offset?: number;
    count?: number;
}

export const getAllAssetStock = async ({
    assignStatus,
    assetTypeUIds,
    assetModelUIds,
    assetBrandUIds,
    allocationTypeUIds,
    distributorUIds,
    outletUIds,
    repairCenterUIds,
    disposalCenterUIds,
    offset = 1,
    count = 999999,
  }: GetAssetStockParams) => {
    try {
      const queryParams = new URLSearchParams({
        Offset: offset.toString(),
        Count: count.toString(),
      });
  
      if (assignStatus) queryParams.append("AssignStatus", assignStatus.toString());
      assetTypeUIds?.forEach((id) => queryParams.append("AssetTypeIds", id.toString()));
      assetModelUIds?.forEach((id) => queryParams.append("AssetModelIds", id.toString()));
      assetBrandUIds?.forEach((id) => queryParams.append("AssetBrandIds", id.toString()));
      allocationTypeUIds?.forEach((id) => queryParams.append("LocationTypeIds", id.toString()));
      distributorUIds?.forEach((id) => queryParams.append("LocationIds", id.toString()));
      outletUIds?.forEach((id) => queryParams.append("LocationIds", id.toString()));
      repairCenterUIds?.forEach((id) => queryParams.append("LocationIds", id.toString()));
      disposalCenterUIds?.forEach((id) => queryParams.append("LocationIds", id.toString()));
  
      const response = await axiosInstance.get(
        `${NEXT_PUBLIC_API_URL}${baseUrl}/assets?${queryParams.toString()}`
      );
  
      const assetStock = get(response, "data.AssetCurrentStock", []);
      
      dispatch(setAssetStock(assetStock));
    } catch (error) {
      console.error("Error fetching asset stock:", error);
      dispatch(setAssetStock([]));
      throw new Error("Failed to fetch asset stock");
    }
  };
  