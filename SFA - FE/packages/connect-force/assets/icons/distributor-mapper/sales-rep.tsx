import React from "react";
import { Box } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import SalesRepImg from "@/assets/images/sales-rep.png";

function SalesRep() {
    return (
        <Box style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
            <Image src={SalesRepImg} alt="SalesRep" width={22} height={22} />
        </Box>
    )
}

export const SalesRepIcon = memo(SalesRep);