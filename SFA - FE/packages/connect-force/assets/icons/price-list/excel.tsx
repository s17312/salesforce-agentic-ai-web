import React from "react";
import { Box } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import Msexcel from "@/assets/images/ExcelIcon.png";

function excel() {
    return (
        <Box style={{ marginRight: '0px', paddingTop: '0px' }}>
            <Image src={Msexcel} alt="Outlet" width={33} height={30} />
        </Box>
    )
}

export const ExcelIcon = memo(excel);