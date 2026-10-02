import React from "react";
import {
  Typography,
  Chip,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Table,
  TableHead,
} from "@mui/material";
import { formatCurrency, formatVolume3Decimals } from "@/utils/formatCurrency";

interface TotalPlusTableRowsProps {
  groupedRows: { [key: string]: any[] };
  edit: boolean;
}

const TotalPlusTableRows: React.FC<TotalPlusTableRowsProps> = ({
  groupedRows,
  edit
}) => {
  const calculateTotals = (rows: any[]) => {
    return rows.reduce(
      (totals, row) => {
        if (edit) {
          totals.totalStockUpdatePlus += row.returnQuantity;
        } else {
          totals.totalStockUpdatePlus += row.stockUpdate;
        }        
        totals.totalVolumePlus += row.volume;
        totals.totalValuePlus += row.value;
        return totals;
      },
      {
        totalStockUpdatePlus: 0,
        totalVolumePlus: 0,
        totalValuePlus: 0,
      }
    );
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#F3EFFF" }}>
            <TableCell align="center">
              <Typography fontSize={13} color="textSecondary">
                <strong>Total Stock Update</strong>
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography fontSize={13} color="textSecondary">
                <strong>Total Volume</strong>
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography fontSize={13} color="textSecondary">
                <strong>UOM</strong>
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography fontSize={13} color="textSecondary">
                <strong>Total Value</strong>
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(groupedRows).map((baseUnit) => {
            const totals = calculateTotals(groupedRows[baseUnit]);
            return (
              <TableRow key={baseUnit}>
                <TableCell align="center">
                  <Chip
                    label={`+${totals.totalStockUpdatePlus}`}
                    size="small"
                    variant="soft"
                    color="success"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`+${formatVolume3Decimals(totals.totalVolumePlus)}`}
                    size="small"
                    variant="soft"
                    color="success"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={baseUnit}
                    size="small"
                    variant="soft"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={`+${formatCurrency(totals.totalValuePlus)}`}
                    size="small"
                    variant="soft"
                    color="success"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TotalPlusTableRows;
