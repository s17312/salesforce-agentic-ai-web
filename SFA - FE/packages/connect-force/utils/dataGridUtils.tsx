import { tooltipSlotProps } from "@/styles/tooltip/tooltipSlotProps";
import { Tooltip } from "@mui/material";

export const getColumnsWithTooltip = (ProductMapperViewTableHeadingsAssign: any[]) => {
  return ProductMapperViewTableHeadingsAssign.map((column) => ({
    ...column,
    renderCell: column.renderCell || ((params: any) => (
      <Tooltip
        title={params.value}
        arrow
        slotProps={tooltipSlotProps}
      >
        <span style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block'
        }}>
          {params.value}
        </span>
      </Tooltip>
    )),
  }));
};