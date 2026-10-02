import { useEffect, useState } from "react";

export const useGRNReportGenerate = (
    poNo: any,
    grnid: any, 
    companyName: any,
    distributorName: any,
    poDate: any,
    deliveryDate: any,
    name: any,
    deliveryMethodName: any
) => {

    const [grnReportInfo, setGRNReportInfo] = useState({
        poNo: "",
        grnid: "",
        companyName: "",
        distributorName: "",
        poDate: "",
        deliveryDate: "",
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
        setGRNReportInfo({
            poNo: poNo || "",
            grnid: grnid || "",
            companyName: companyName || "",
            distributorName: distributorName || "",
            poDate: formatDate(poDate) || "",
            deliveryDate: formatDate(deliveryDate) || "",
            name: name || "",
            deliveryMethodName: deliveryMethodName || ""
        });
    }, [poNo, grnid, companyName, distributorName, poDate, deliveryDate, name, deliveryMethodName]);

    const handleClose = () => {
        setOpen(false);
    }

    return {
        grnReportInfo,
        fileName,
        open,
        setOpen,
        handleClose,
    };
}