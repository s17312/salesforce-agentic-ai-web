import React, { useEffect } from "react";
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

interface StockAdjustmentDetail {
  stockAdjustmentDetailId: number;
  productID: number;
  productUID: number;
  productName: string;
  stockAvailable: number;
  mrp: number;
  rate: number;
  updateQuantity: number;
  volume: number;
  value: number;
  baseUnitId?: number;
  baseUnitName?: string;
  createdBy: number;
  creationDate: string;
  modifiedBy: number;
  modifiedDate: string;
}

interface TotalTableRowsProps {
  stockAdjustmentDetail: StockAdjustmentDetail[];
}

const TotalTableRows: React.FC<TotalTableRowsProps> = ({ stockAdjustmentDetail }) => {
  const groupRowsByBaseUnit = (rows: StockAdjustmentDetail[]) => {
    return rows.reduce<{ [key: string]: StockAdjustmentDetail[] }>((acc, row) => {
      const baseUnit = row.baseUnitName || "Unknown";
      if (!acc[baseUnit]) {
        acc[baseUnit] = [];
      }
      acc[baseUnit].push(row);
      return acc;
    }, {});
  };

  // Calculate totals for a group of rows
  const calculateTotals = (rows: StockAdjustmentDetail[]) => {
    const totals = rows.reduce(
      (totals, row) => {
        const isIncrement = row.updateQuantity > 0 || row.volume > 0 || row.value > 0;

        if (isIncrement) {
          totals.totalStockUpdatePlus += row.updateQuantity || 0;
          totals.totalVolumePlus += row.volume || 0;
          totals.totalValuePlus += row.value || 0;
        } else {
          totals.totalStockUpdateMinus += row.updateQuantity || 0;
          totals.totalVolumeMinus += row.volume || 0;
          totals.totalValueMinus += row.value || 0;
        }

        return totals;
      },
      {
        totalStockUpdatePlus: 0,
        totalVolumePlus: 0,
        totalValuePlus: 0,
        totalStockUpdateMinus: 0,
        totalVolumeMinus: 0,
        totalValueMinus: 0,
      }
    );

    return {
      totalStockUpdatePlus: totals.totalStockUpdatePlus,
      totalVolumePlus: formatVolume3Decimals(totals.totalVolumePlus),
      totalValuePlus: formatCurrency(totals.totalValuePlus),
      totalStockUpdateMinus: totals.totalStockUpdateMinus,
      totalVolumeMinus: formatVolume3Decimals(totals.totalVolumeMinus),
      totalValueMinus: formatCurrency(totals.totalValueMinus),
    };
  };

  // Group rows by base unit
  const groupedRows = groupRowsByBaseUnit(stockAdjustmentDetail);

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#F3EFFF" }}>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  #
                </Typography>
              </TableCell>
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
                <React.Fragment key={baseUnit}>
                  <TableRow>
                    <TableCell>
                      <Typography fontSize={13} color="textSecondary">
                        <strong>Plus (+)</strong>
                      </Typography>
                    </TableCell>
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
                        label={`+${totals.totalVolumePlus}`}
                        size="small"
                        variant="soft"
                        color="success"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${baseUnit}`}
                        size="small"
                        variant="soft"
                        // color="success"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`+${totals.totalValuePlus}`}
                        size="small"
                        variant="soft"
                        color="success"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#f7f4ff" }}>
                    <TableCell>
                      <Typography fontSize={13} color="textSecondary">
                        <strong>Minus (-)</strong>
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={totals.totalStockUpdateMinus}
                        size="small"
                        variant="soft"
                        color="error"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={totals.totalVolumeMinus}
                        size="small"
                        variant="soft"
                        color="error"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${baseUnit}`}
                        size="small"
                        variant="soft"
                        // color="success"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={totals.totalValueMinus}
                        size="small"
                        variant="soft"
                        color="error"
                        sx={{ borderRadius: 1 }}
                      />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TotalTableRows;
