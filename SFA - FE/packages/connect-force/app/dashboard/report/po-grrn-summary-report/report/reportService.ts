import { useEffect, useState } from "react";

export const usePOGRNReportGeneration = (
    getValues: any,
    companiesOptions: any,
    distributorsOptions: any,
    priceListOptions: any
) => {
    const [poGRNReportInfo, setPOGRNReportInfo] = useState({
        company: "",
        distributor: "",
        priceList: "",
        fromDate: "",
        toDate: "",
    });

    const [open, setOpen] = useState(false);

    const { companyUId, distributorUId, priceListUId, fromDate, toDate } =
        getValues();

    const formatDate = (date: any) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return String(date).split("T")[0];
    };

    const fileName = `PO-GRN Summary Report - ${formatDate(fromDate)} to ${formatDate(toDate)}`;

    const companyName = companiesOptions.find(
        (company: any) => company.value === companyUId
    )?.label;

    const distributorName = distributorsOptions.find(
        (distributor: any) => distributor.value === distributorUId
    )?.label;

    const priceListName = priceListOptions.find(
        (priceList: any) => priceList.value === priceListUId
    )?.label;

    useEffect(() => {
        setPOGRNReportInfo({
            company: companyName || "All",
            distributor: distributorName || "All",
            priceList: priceListName || "All",
            fromDate: fromDate ? formatDate(fromDate) : "",
            toDate: toDate ? formatDate(toDate) : "",
        });
    }, [
        companyName,
        distributorName,
        priceListName,
        fromDate,
        toDate,
    ]);

    const handleClose = () => {
        setOpen(false);
    }

    return { poGRNReportInfo, fileName, open, setOpen, handleClose };
};