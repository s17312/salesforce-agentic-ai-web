import { useEffect, useState } from "react";

export const useInvoiceAgingReportGenerate = (
    getValues: any,
    companiesOptions: any,
    distributorsOptions: any,
    representativeOptions: any,
    routeOptions: any,
    outletOptions: any,
    tourTypesOptions: any
) => {
    const [invoiceAgingReportInfo, setInvoiceAgingReportInfo] = useState({
        fromDate: "",
        toDate: "",
        company: "",
        distributor: "",
        representative: "",
        route: "",
        outlet: [],
        tourType: []
    });

    const [open, setOpen] = useState(false);

    const {
        fromDate,
        toDate,
        tourTypes,
        companyUId,
        distributorUId,
        representativeUId,
        routeUId,
        outletUId,
    } = getValues();

    const formatDate = (date: any) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return String(date).split("T")[0];
    };

    const fileName = `Invoice Aging Report - ${formatDate(fromDate)} to ${formatDate(toDate)}`;

    const companyName = companyUId
        ? companiesOptions.find((company: any) => company.value === companyUId)
            ?.label
        : "-";

    const distributorNames = distributorUId
        ? distributorsOptions.find((distributor: any) => distributor.value === distributorUId)
            ?.label
        : "-";

    const representativeNames = representativeUId
        ? representativeOptions.find((representative: any) => representative.value === representativeUId)
            ?.label
        : "-";

    const routeNames = routeUId
        ? routeOptions.find((route: any) => route.value === routeUId)
            ?.label
        : "-";

    const outletNames = (outletUId || []).map((id: any) => {
        return (
            outletOptions.find((outlet: any) => outlet.value === id)
                ?.label || "-"
        );
    });

    const tourTypeNames = (tourTypes || []).map((type: any) => {
        return (
            tourTypesOptions.find((tourType: any) => tourType.value === type)?.label ||
            "-"
        );
    });

    useEffect(() => {
        setInvoiceAgingReportInfo({
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
            company: companyName,
            distributor: distributorNames,
            representative: representativeNames,
            route: routeNames,
            outlet: outletNames,
            tourType: tourTypeNames,
        });
    }, [fromDate, toDate, companyUId, distributorUId, representativeUId, routeUId, outletUId, tourTypes]);

    const handleClose = () => {
        setOpen(false);
    };

    return {
        invoiceAgingReportInfo,
        fileName,
        open,
        setOpen,
        handleClose
    };
}
