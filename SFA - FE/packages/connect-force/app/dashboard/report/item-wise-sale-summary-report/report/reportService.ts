import { useEffect, useState } from "react";

export const useItemWiseSaleSummaryReportGenerate = (
    getValues: any,
    companiesOptions: any,
    distributorsOptions: any,
    representativeOptions: any,
    productsOptions:any,
) => {
    const [itemWiseSaleSummaryReportInfo, setItemWiseSaleSummaryReportInfo] = useState({
        fromDate: "",
        toDate: "",
        company: "",
        distributor: "",
        representatives: [],
        products:[]
    });

    const [open, setOpen] = useState(false);

    const {
        fromDate,
        toDate,
        companyUId,
        distributorUId,
        representativeUId,
        productUId,
    } = getValues();

    const fileName = `Invoice Detail Report - ${fromDate} to ${toDate}`;

    const companyName = companyUId
        ? companiesOptions.find((company: any) => company.value === companyUId)
            ?.label
        : "-";

    const distributorNames = distributorUId
        ? distributorsOptions.find((distributor: any) => distributor.value === distributorUId)
            ?.label
        : "-";

    const representativeNames = (representativeUId || []).map((id: any) => {
        return representativeOptions.find((rep: any) => rep.value === id)?.label;
    });

    const productNames = (productUId || []).map((id: any) => {
        return productsOptions.find((product: any) => product.value === id)?.label;
    });

    const formatDate = (date: any) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return String(date).split("T")[0];
    };

    useEffect(() => {
        setItemWiseSaleSummaryReportInfo({
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
            company: companyName,
            distributor: distributorNames,
            representatives: representativeNames,
            products:productNames,
        });
    }, [fromDate, toDate, companyUId, distributorUId, representativeUId, productUId]);

    const handleClose = () => {
        setOpen(false);
    }

    return {
        itemWiseSaleSummaryReportInfo,
        open,
        setOpen,
        fileName,
        handleClose
    };
}