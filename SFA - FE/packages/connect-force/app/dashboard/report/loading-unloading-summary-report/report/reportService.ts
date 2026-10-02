import { useEffect, useState } from 'react';

export const useLoadingUnloadingSummaryReportGenerate = (
    getValues: any,
    companiesOptions: any,
    distributorsOptions: any,
    priceListOptions: any,
    representativeOptions: any,
    vehicleOptions: any,
    tourTypesOptions: any
) => {
    const [loadingUnloadingSummaryReportInfo, setLoadingUnloadingSummaryReportInfo] = useState({
        fromDate: "",
        toDate: "",
        company: "",
        distributor: "",
        priceList: "",
        representative: "",
        vehicle: [],
        tourType: []
    });

    const [open, setOpen] = useState(false);

    const {
        fromDate,
        toDate,
        tourTypes,
        companyUId,
        distributorUId,
        priceListUId,
        representativeUId,
        vehicleUId,
    } = getValues();

    const formatDate = (date: any) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return String(date).split("T")[0];
    };

    const fileName = `Loading Unloading Summary Report - ${formatDate(fromDate)} to ${formatDate(toDate)}`;

    const companyName = companyUId
        ? companiesOptions.find((company: any) => company.value === companyUId)
            ?.label
        : "-";

    const distributorNames = distributorUId
        ? distributorsOptions.find((distributor: any) => distributor.value === distributorUId)
            ?.label
        : "-";

    const priceListName = priceListOptions.find(
        (priceList: any) => priceList.value === priceListUId
    )?.label;

    const representativeNames = representativeUId
        ? representativeOptions.find((representative: any) => representative.value === representativeUId)
            ?.label
        : "-";

    const vehicleNames = (vehicleUId || []).map((id: any) => {
        return (
            vehicleOptions.find((vehicle: any) => vehicle.value === id)
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
        setLoadingUnloadingSummaryReportInfo({
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
            company: companyName,
            distributor: distributorNames,
            priceList: priceListName,
            representative: representativeNames,
            vehicle: vehicleNames,
            tourType: tourTypeNames,
        });
    }, [fromDate, toDate, companyUId, distributorUId, priceListUId, representativeUId, vehicleUId, tourTypes]);

    const handleClose = () => {
        setOpen(false);
    }

    return {
        loadingUnloadingSummaryReportInfo,
        open,
        setOpen,
        fileName,
        handleClose
    };
}
