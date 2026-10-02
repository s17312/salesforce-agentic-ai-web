import { Chip } from "@mui/material";

export type Status =
  | "null"
  | "true"
  | "false"
  | "inprogress"
  | "completed"
  | "return"
  | "pending return";
export type SaleStatus = "null" | 1 | 2 | 3 | 4;

const statusStyles = {
  null: { backgroundColor: "rgba(108, 117, 125, 0.85)", color: "#FFFFFF" }, // Neutral Gray
  true: { backgroundColor: "rgba(72, 184, 72, 0.85)", color: "#FFFFFF" }, // Success Green
  false: { backgroundColor: "rgba(220, 53, 69, 0.85)", color: "#FFFFFF" }, // Error Red
  inprogress: { backgroundColor: "rgba(0, 123, 255, 0.897)", color: "#FFFFFF" }, // Info Blue
  completed: { backgroundColor: "rgba(23, 163, 184, 0.925)", color: "#FFFFFF" }, // Calm Teal
  return: { backgroundColor: "#205781", color: "#FFFFFF" },
  "pending return": { backgroundColor: "#ff8c00", color: "#FFFFFF" },
};

const statusDescriptions = {
  null: "To Do",
  true: "Sale",
  false: "Lost",
  inprogress: "In Progress",
  completed: "Completed",
  return: "Return",
  "pending return": "Pending Return",
};

interface SalesStatusChipProps {
  status: Status;
  saleStatus: SaleStatus;
}

export const Sales_StatusChip = ({
  status,
  saleStatus,
}: SalesStatusChipProps) => {
  let displayStatus: Status = status;

  if (saleStatus === 1) {
    displayStatus = "inprogress";
  } else if (saleStatus === 2) {
    displayStatus = "completed";
  } else if (saleStatus === 3) {
    displayStatus = "pending return";
  } else if (saleStatus === 4) {
    displayStatus = "return";
  }

  return (
    <Chip
      label={statusDescriptions[displayStatus]}
      style={statusStyles[displayStatus]}
      size="small"
      sx={{ fontSize: "0.75rem" }}
    />
  );
};
