import { Chip } from "@mui/material";
import React from "react";

export type Status = 0 | 1;

const statusStyles = {
  0: { backgroundColor: "rgba(255, 165, 0, 0.7)", color: "white" },
  1: { backgroundColor: "rgba(0, 128, 0, 0.7)", color: "white" },
};

const statusLabels = {
  0: "Pending",
  1: "Submitted",
};

export const SimpleStatusChip = React.memo(({ status }: { status: Status }) => {
  return (
    <Chip
      label={statusLabels[status]}
      style={statusStyles[status]}
      size="small"
      variant="soft"
      sx={{ fontSize: "0.75rem" }}
    />
  );
});
