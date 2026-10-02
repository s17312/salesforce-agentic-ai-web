import { useEffect, useState } from "react";

export const useOutletMappingReportGenerate = (
  getValues: any,
  companiesOptions: any,
  distributorsOptions: any,
  representativeOptions: any,
  routeOptions: any,
  outletOptions: any
) => {
  const [outletMappingReportInfo, setOutletMappingReportInfo] = useState({
    company: "",
    distributor: "",
    representative: [],
    route: [],
    outlet: [],
  });

  const [open, setOpen] = useState(false);

  const { companyUId, distributorUId, representativeUId, routeUId, outletUId } =
    getValues();

  const fileName = `Outlet Mapping Report`;

  const companyName = companyUId
    ? companiesOptions.find((company: any) => company.value === companyUId)
        ?.label
    : "-";

  const distributorNames = distributorUId
    ? distributorsOptions.find(
        (distributor: any) => distributor.value === distributorUId
      )?.label
    : "-";

  const representativeNames = (representativeUId || []).map((id: any) => {
    return (
      representativeOptions.find(
        (representative: any) => representative.value === id
      )?.label || "-"
    );
  });

  const routeNames = (routeUId || []).map((id: any) => {
    return routeOptions.find((route: any) => route.value === id)?.label || "-";
  });

  const outletNames = (outletUId || []).map((id: any) => {
    return (
      outletOptions.find((outlet: any) => outlet.value === id)?.label || "-"
    );
  });

  useEffect(() => {
    setOutletMappingReportInfo({
      company: companyName,
      distributor: distributorNames,
      representative: representativeNames,
      route: routeNames,
      outlet: outletNames,
    });
  }, [companyUId, distributorUId, representativeUId, routeUId, outletUId]);

  const handleClose = () => {
    setOpen(false);
  };

  return {
    outletMappingReportInfo,
    fileName,
    open,
    setOpen,
    handleClose,
  };
};
