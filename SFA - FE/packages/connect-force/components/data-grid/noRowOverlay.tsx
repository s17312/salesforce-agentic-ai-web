import React from "react";
import { Box, Typography } from "@mui/material";

export function CustomNoRowsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        py: 6,
      }}
    >
      <svg width="100" height="90" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Box outline */}
        <rect x="25" y="45" width="50" height="32" rx="4" fill="#DDE1F0" stroke="#B8C0DF" strokeWidth="2" />
        <path d="M25 55L40 55C43 55 45 57 45 60C45 63 47 65 50 65C53 65 55 63 55 60C55 57 57 55 60 55L75 55" stroke="#B8C0DF" strokeWidth="2" />
        {/* Document pages inside */}
        <rect x="35" y="22" width="30" height="32" rx="2" fill="#FFFFFF" stroke="#CCD2EA" strokeWidth="2" />
        <line x1="41" y1="28" x2="59" y2="28" stroke="#DDE1F0" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="34" x2="59" y2="34" stroke="#DDE1F0" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="40" x2="51" y2="40" stroke="#DDE1F0" strokeWidth="2" strokeLinecap="round" />
        {/* Speech bubble with dots */}
        <circle cx="68" cy="22" r="11" fill="#E4E8F5" />
        <path d="M63 29L61 34L67 31" fill="#E4E8F5" />
        <circle cx="63" cy="22" r="1.5" fill="#A4AECE" />
        <circle cx="68" cy="22" r="1.5" fill="#A4AECE" />
        <circle cx="73" cy="22" r="1.5" fill="#A4AECE" />
      </svg>
      <Typography sx={{ mt: 1.5, color: "#4a5173", fontWeight: 600, fontSize: "0.9rem" }}>
        No Rows
      </Typography>
    </Box>
  );
}

export const StyledGridOverlay = CustomNoRowsOverlay;
export default CustomNoRowsOverlay;