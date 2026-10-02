import { Switch } from "@mui/material";
import { styled } from "@mui/system";

export const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: theme.palette.success.main,
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: theme.palette.success.main,
  },
  "& .MuiSwitch-switchBase": {
    color: theme.palette.error.main,
  },
  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
    backgroundColor: theme.palette.error.main,
  },
}));
