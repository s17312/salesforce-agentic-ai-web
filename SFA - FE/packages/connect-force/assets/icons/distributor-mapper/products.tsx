import React from "react";
import { Box } from "@mui/material";
import { memo } from "react";
import Image from "next/image";
import ProductImg from "@/assets/images/products.png";

function product() {
    return (
        <Box style={{ marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={ProductImg} alt="Product" width={20} height={20} />
        </Box>
    )
}

export const ProductIcon = memo(product);