import { useEffect, useState } from "react";

export const useDisributorSalesReportGenerate = (
  getValues: any,
  companiesOptions: any,
  distributorsOptions: any,
  representativeOptions: any,
  tourTypesOptions: any
) => {
  const [distributorSalesReportInfo, setDistributorSalesReportInfo] = useState({
    fromDate: "",
    toDate: "",
    company: "",
    distributor: "",
    representative: [],
    tourType: [],
  });

  const [open, setOpen] = useState(false);

  const {
    fromDate,
    toDate,
    companyUId,
    distributorUId,
    representativeUId,
    tourTypes,
  } = getValues();

  const formatDate = (date: any) => {
    if (!date) return "";
    if (date instanceof Date) {
      return date.toISOString().split("T")[0];
    }
    return String(date).split("T")[0];
  };

  const fileName = `Distributor Wise Sales Report - ${formatDate(
    fromDate
  )} to ${formatDate(toDate)}`;

  const companyName = companyUId
    ? companiesOptions.find((company: any) => company.value === companyUId)
        ?.label
    : "-";

  const distributorNames = distributorUId
    ? distributorsOptions.find(
        (distributor: any) => distributor.value === distributorUId
      )?.label
    : "-";

  const representativeNames = (representativeUId || []).map((type: any) => {
    return (
      representativeOptions.find(
        (representative: any) => representative.value === type
      )?.label || "-"
    );
  });

  const tourTypeNames = (tourTypes || []).map((type: any) => {
    return (
      tourTypesOptions.find((tourType: any) => tourType.value === type)
        ?.label || "-"
    );
  });

  useEffect(() => {
    setDistributorSalesReportInfo({
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      company: companyName,
      distributor: distributorNames,
      representative: representativeNames,
      tourType: tourTypeNames,
    });
  }, [
    fromDate,
    toDate,
    companyUId,
    distributorUId,
    representativeUId,
    tourTypes,
  ]);

  const handleClose = () => {
    setOpen(false);
  };

  return {
    distributorSalesReportInfo,
    fileName,
    open,
    setOpen,
    handleClose,
  };
};
