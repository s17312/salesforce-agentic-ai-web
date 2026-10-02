import { useDispatch } from "@/redux/store";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';

const PermissionActionCell = ({
  row,
  viewPath,
  editPath,
  dispatchSlice,
}: {
  row: any;
  viewPath: string;
  editPath: string;
  dispatchSlice: any;
}) => {
  const dispatch = useDispatch();

  const onClickView = () => {
    dispatch(dispatchSlice(row));
  };

  const onClickEdit = () => {
    
    dispatch(dispatchSlice(row));
  };

  return (
    <>
      {row.active ? (
        <Link href={`${editPath}/${row.uId}`}>
          <Tooltip title={"Permissions"}>
            <IconButton onClick={onClickEdit}>
              <KeyRoundedIcon
                fontSize="small"
                sx={{ color: tableIconColors.permissionIcon }}
              />
            </IconButton>
          </Tooltip>
        </Link>
      ) : (
        <IconButton disabled>
          <KeyRoundedIcon
            fontSize="small"
            sx={{ color: tableIconColors.disabledIcon }}
          />
        </IconButton>
      )}
    </>
  );
};

export default PermissionActionCell;
