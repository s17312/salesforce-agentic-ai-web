import { getCurrentDate } from "@/utils/reports/reportUtils";
import { get } from "lodash";
import { useEffect, useState } from "react";

export const useCSReportGeneration = (
    getValues: any,
    mappingItems: string,
    distributorsOptions: any,
) => {
    const [distributorMappingInfo, setDistributorMappingInfo] = useState({
        mappingItems: "",
        distributor: [],
    });
    const [open, setOpen] = useState(false);

    const fileName = `Distributor Mapping View - ${getCurrentDate()}`;

    const {
        distributorUIds,
    } = getValues();

    const mappingItemsName = mappingItems;

    const distributorNames = (distributorUIds || []).map((id: any) => {
        return (
            distributorsOptions.find((distributor: any) => distributor.value === id)
                ?.label || "Undefined Distributor"
        );
    });

    useEffect(() => {
        setDistributorMappingInfo({
            mappingItems: mappingItemsName,
            distributor: distributorNames,
        });
    }, [mappingItems, distributorUIds]);

    const handleClose = () => {
        setOpen(false);
    };

    return {
        distributorMappingInfo,
        open,
        setOpen,
        fileName,
        handleClose,
    };
};