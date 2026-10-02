import { useEffect, useState } from "react";

export const usePOCreateReportGenerate = (
    poNo: any,
    companyName: any,
    distributorName: any,
    poDate: any,
    deliveryDate: any,
    priceListTypeName: any,
    name: any,
    deliveryMethodName: any
) => {

    const [poCreateReportInfo, setPOCreateReportInfo] = useState({
        poNo: "",
        companyName: "",
        distributorName: "",
        poDate: "",
        deliveryDate: "",
        priceListTypeName: "",
        name: "",
        deliveryMethodName: ""
    });

    const [open, setOpen] = useState(false);

    const formatDate = (date: any) => {
        if (!date) return "";
        if (date instanceof Date) {
            return date.toISOString().split("T")[0];
        }
        return String(date).split("T")[0];
    };

    const fileName = `Cash Collection Report - ${formatDate(poDate)}`;

    useEffect(() => {
        setPOCreateReportInfo({
            poNo: poNo || "",
            companyName: companyName || "",
            distributorName: distributorName || "",
            poDate: formatDate(poDate) || "",
            deliveryDate: formatDate(deliveryDate) || "",
            priceListTypeName: priceListTypeName || "",
            name: name || "",
            deliveryMethodName: deliveryMethodName || ""
        });
    }, [poNo, companyName, distributorName, poDate, deliveryDate, priceListTypeName, name, deliveryMethodName]);

    const handleClose = () => {
        setOpen(false);
    }

    return {
        poCreateReportInfo,
        fileName,
        open,
        setOpen,
        handleClose,
    };
}