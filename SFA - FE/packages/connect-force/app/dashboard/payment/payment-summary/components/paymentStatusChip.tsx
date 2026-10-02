import { Chip } from "@mui/material";

export type Status = 1 | 2 | 3 | 4;

const statusStyles = {
  1: {
    backgroundColor: "rgba(0, 123, 255, 0.7)",
    color: "white",
    cursor: "pointer",
  }, // Deposited
  2: { backgroundColor: "rgba(255, 87, 34, 0.7)", color: "white" }, // Bounced
  3: { backgroundColor: "rgba(40, 167, 69, 0.7)", color: "white" }, // Completed
  4: { backgroundColor: "rgba(127, 40, 167, 0.7)", color: "white" }, // Clear
};

const statusDescriptions = {
  1: "Deposited",
  2: "Bounced",
  3: "Completed",
  4: "Clear",
};

interface PaymentStatusChipProps {
  status: Status;
  onClick?: () => void;
}

export const Payment_StatusChip = ({
  status,
  onClick,
}: PaymentStatusChipProps) => {
  return (
    <Chip
      label={statusDescriptions[status]}
      style={statusStyles[status]}
      size="small"
      variant="soft"
      sx={{ fontSize: "0.75rem" }}
      onClick={status === 1 ? onClick : undefined} // only Deposited clickable
    />
  );
};
