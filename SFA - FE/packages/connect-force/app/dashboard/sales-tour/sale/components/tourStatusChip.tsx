import { Chip } from "@mui/material";
import { el } from "date-fns/locale";

export type Status =
  | "null"
  | "true"
  | "false"
  | "save"
  | "completed"
  | "deleted"
  | "lost";
export type SaleStatus = "null" | 1 | 2 | 3 | 4;

const statusStyles = {
  null: { backgroundColor: "rgba(108, 117, 125, 0.85)", color: "#FFFFFF" }, // Neutral Gray
  true: { backgroundColor: "rgba(72, 184, 72, 0.85)", color: "#FFFFFF" }, // Success Green
  false: { backgroundColor: "rgba(220, 53, 69, 0.85)", color: "#FFFFFF" }, // Error Red
  save: { backgroundColor: "rgba(0, 123, 255, 0.897)", color: "#FFFFFF" }, // Info Blue
  completed: { backgroundColor: "rgba(23, 163, 184, 0.925)", color: "#FFFFFF" }, // Calm Teal
  deleted: { backgroundColor: "rgba(219, 43, 75, 0.63)", color: "#FFFFFF" }, // Error Red
  lost: { backgroundColor: "rgba(220, 53, 69, 0.85)", color: "#FFFFFF" }, // Error Red
};

const statusDescriptions = {
  null: "To Do",
  true: "Sale",
  false: "Lost",
  save: "Saved",
  completed: "Completed",
  deleted: "Deleted",
  lost: "Lost",
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
    displayStatus = "save";
  } else if (saleStatus === 2) {
    displayStatus = "completed";
  } else if (saleStatus === 3) {
    displayStatus = "deleted";
  } else if (saleStatus === 4) {
    displayStatus = "lost";
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
