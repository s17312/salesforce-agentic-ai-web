import { customContainerType } from "@/types/componentTypes/custom-container-types";
import { Box } from "@mui/material";
import React from "react";

const CustomContainer = (props: customContainerType) => {
  return (
    <Box
      component="button"
      sx={{
        backgroundColor: props.backgroundColor,
        width: "auto",
        color: props.fontColor,
        border: "transparent",
        borderRadius: "6px",
        padding: "2px 8px 2px 8px",
        textAlign: "center",
        fontSize: "12px",
        textDecoration: "none",
        fontWeight: "bold",
        height: "24px",
      }}
    >
      {props.name}
    </Box>
  );
};

export default CustomContainer;
