import { useEffect, useState } from "react";


export const useTourSummaryReportGenerate = (
    getValues: any,
    companiesOptions: any,
    distributorsOptions: any,
    representativesOptions: any,
    tourTypesOptions: any
) => {
    const [tourSummaryReportInfo, setTourSummaryReportInfo] = useState({
        fromDate: "",
        toDate: "",
        company: "",
        distributor: "",
        representative: [],
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
    } = getValues();

    const fileName = `Tour Summary Report - ${fromDate} to ${toDate}`;

    const companyName = companyUId
        ? companiesOptions.find((company: any) => company.value === companyUId)
            ?.label
        : "-";

    const distributorNames = distributorUId
        ? distributorsOptions.find((distributor: any) => distributor.value === distributorUId)
            ?.label
        : "-";

    const representativeNames = (representativeUId || []).map((id: any) => {
        return (
            representativesOptions.find((representative: any) => representative.value === id)
                ?.label || "-"
        );
    });

    const tourTypeNames = (tourTypes || []).map((type: any) => {
        return (
            tourTypesOptions.find((tourType: any) => tourType.value === type)?.label ||
            "-"
        );
    });

    const formatDate = (date: any) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return String(date).split("T")[0];
    };

    useEffect(() => {
        setTourSummaryReportInfo({
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
            company: companyName,
            distributor: distributorNames,
            representative: representativeNames,
            tourType: tourTypeNames,
        });
    }, [fromDate, toDate, companyUId, distributorUId, representativeUId, tourTypes]);

    const handleClose = () => {
        setOpen(false);
    }

    return {
        tourSummaryReportInfo,
        open,
        setOpen,
        fileName,
        handleClose
    };
}