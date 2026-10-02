import React from "react";
import { Box } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import DistributorImg from "@/assets/images/distributor.png";

function distributor() {
    return (
        <Box style={{ marginRight: '10px', paddingTop: '4px' }}>
            <Image src={DistributorImg} alt="Outlet" width={20} height={20} />
        </Box>
    )
}

export const DistributorIcon = memo(distributor);