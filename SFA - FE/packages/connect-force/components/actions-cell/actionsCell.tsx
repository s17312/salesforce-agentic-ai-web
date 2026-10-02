import { useDispatch } from "@/redux/store";
import { tableIconColors } from "@/styles/tableStyles/tableStyle";
import { IconButton, Tooltip } from "@mui/material";
import Link from "next/link";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const ActionCell = ({
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
      <Link href={`${viewPath}/${row.uId}`}>
        <Tooltip title={"View"}>
          <IconButton onClick={onClickView}>
            <VisibilityIcon
              fontSize="small"
              sx={{ color: tableIconColors.visibilityIcon }}
            />
          </IconButton>
        </Tooltip>
      </Link>
      {row.active ? (
        <Link href={`${editPath}${row.uId}`}>
          <Tooltip title={"Update"}>
            <IconButton onClick={onClickEdit}>
              <EditIcon
                fontSize="small"
                sx={{ color: tableIconColors.editIconColor }}
              />
            </IconButton>
          </Tooltip>
        </Link>
      ) : (
        <IconButton disabled>
          <EditIcon
            fontSize="small"
            sx={{ color: tableIconColors.disabledIcon }}
          />
        </IconButton>
      )}
    </>
  );
};

export default ActionCell;
