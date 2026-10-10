import React, { memo } from "react";
import { Box } from "@mui/material";
import GoogleIcon from "@/components/icons/GoogleIcon";

function product() {
  return (
    <Box sx={{ mr: 0.8, display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}>
      <GoogleIcon name="inventory_2" size={18} />
    </Box>
  );
}

export const ProductIcon = memo(product);