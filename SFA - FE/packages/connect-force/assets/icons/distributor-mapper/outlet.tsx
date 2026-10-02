import React from "react";
import { Box } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import OutletImg from "@/assets/images/outlet.png";

function outlet() {
    return (
        <Box style={{ marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={OutletImg} alt="Outlet" width={18} height={18} />
        </Box>
    )
}

export const OutletIcon = memo(outlet);