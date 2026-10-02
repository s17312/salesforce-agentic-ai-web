import React from "react";
import { Box } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import CompanyImg from "@/assets/images/company.png";

function company() {
    return (
        <Box style={{ marginRight: '10px', paddingTop: '4px' }}>
            <Image src={CompanyImg} alt="Outlet" width={20} height={20} />
        </Box>
    )
}

export const CompanyIcon = memo(company);