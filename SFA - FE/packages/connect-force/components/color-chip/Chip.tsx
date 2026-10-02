import { Chip } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const StatusChip = ({ status }: any) => {
  return (
    <Chip
      icon={<FiberManualRecordIcon sx={{ fontSize: "15px" }} />}
      label={status === true ? "Active" : "Inactive"}
      color={status === true ? "success" : "error"}
      variant="soft"
      sx={{ width: 100 }}
    />
  );
};

export default StatusChip;
