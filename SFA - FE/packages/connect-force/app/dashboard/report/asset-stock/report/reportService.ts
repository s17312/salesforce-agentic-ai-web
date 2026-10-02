// packages/connect-force/services/assetStockService.ts
import { useState, useEffect } from "react";
import { getCurrentDate } from "@/utils/reports/reportUtils";

export const useAssetStockReportGeneration = (
  getValues: any,
  assetTypeOptions: any,
  assetModelOptions: any,
  assetBrandOptions: any,
  assignStatusOptions: any,
  allocationTypeOptions: any,
  distributorsOptions: any,
  outletsOptions: any,
  repairCentersOptions: any,
  disposalCentersOptions: any
) => {
  const [assetInfo, setAssetInfo] = useState({
    assetType: [],
    assetBrand: [],
    assetModel: [],
    assignStatus: "",
    allocationType: [],
    distributor: [],
    outlet: [],
    repairCenter: [],
    disposalCenter: [],
  });

  const [open, setOpen] = useState(false);

  const fileName = `Asset Stock View - ${getCurrentDate()}`;

  const {
    assetTypeIds,
    assetBrandIds,
    assetModelIds,
    assignStatus,
    allocationTypeIds,
    distributorIds,
    outletIds,
    repairCenterIds,
    disposalCenterIds,
  } = getValues();

  const assignStatusName = assignStatus
    ? assignStatusOptions.find((status: any) => status.value === assignStatus)
      ?.label
    : "Undefined Assign Status";

  const assetTypeNames = (assetTypeIds || []).map((id: any) => {
    return (
      assetTypeOptions.find((type: any) => type.value === id)?.label ||
      "Undefined Asset Type"
    );
  });

  const assetBrandNames = (assetBrandIds || []).map((id: any) => {
    return (
      assetBrandOptions.find((brand: any) => brand.value === id)?.label ||
      "Undefined Asset Brand"
    );
  });

  const assetModelNames = (assetModelIds || []).map((id: any) => {
    return (
      assetModelOptions.find((model: any) => model.value === id)?.label ||
      "Undefined Asset Model"
    );
  });

  const allocationTypeNames = (allocationTypeIds || []).map((id: any) => {
    return (
      allocationTypeOptions.find((type: any) => type.value === id)?.label ||
      "Undefined Allocation Type"
    );
  });

  const distributorNames = (distributorIds || []).map((id: any) => {
    return (
      distributorsOptions.find((distributor: any) => distributor.value === id)
        ?.label || "Undefined Distributor"
    );
  });

  const outletNames = (outletIds || []).map((id: any) => {
    return (
      outletsOptions.find((outlet: any) => outlet.value === id)?.label ||
      "Undefined Outlet"
    );
  });

  const repairCenterNames = (repairCenterIds || []).map((id: any) => {
    return (
      repairCentersOptions.find(
        (repairCenter: any) => repairCenter.value === id
      )?.label || "Undefined Repair Center"
    );
  });

  const disposalCenterNames = (disposalCenterIds || []).map((id: any) => {
    return (
      disposalCentersOptions.find(
        (disposalCenter: any) => disposalCenter.value === id
      )?.label || "Undefined Disposal Center"
    );
  });

  useEffect(() => {
    setAssetInfo({
      assetType: assetTypeNames,
      assetBrand: assetBrandNames,
      assetModel: assetModelNames,
      assignStatus: assignStatusName,
      allocationType: allocationTypeNames,
      distributor: distributorNames,
      outlet: outletNames,
      repairCenter: repairCenterNames,
      disposalCenter: disposalCenterNames,
    });
  }, [
    assetTypeIds,
    assetBrandIds,
    assetModelIds,
    assignStatus,
    allocationTypeIds,
    distributorIds,
    outletIds,
    repairCenterIds,
    disposalCenterIds,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  return {
    assetInfo,
    open,
    setOpen,
    fileName,
    handleClose,
  };

};
