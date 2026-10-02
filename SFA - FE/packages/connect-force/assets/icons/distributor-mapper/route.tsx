import React from "react";
import { Box } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import RouteImg from "@/assets/images/route.png";

function Route() {
    return (
        <Box style={{ marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={RouteImg} alt="Route" width={18} height={18} />
        </Box>
    )
}

export const RouteIcon = memo(Route);