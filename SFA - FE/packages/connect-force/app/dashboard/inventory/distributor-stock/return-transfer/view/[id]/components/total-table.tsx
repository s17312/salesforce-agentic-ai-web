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

interface DistributorStockReturnDetail {
  stockAdjustmentDetailId: number;
  productUId: number;
  productID: number;
  productName: string;
  stockAvailable: number;
  mrp: number;
  rate: number;
  returnQuantity: number;
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
  distributorStockReturnDetail?: DistributorStockReturnDetail[];
}

const TotalTableRows: React.FC<TotalTableRowsProps> = ({ distributorStockReturnDetail }) => {

  const groupRowsByBaseUnit = (rows: DistributorStockReturnDetail[]) => {
    return rows.reduce<{ [key: string]: DistributorStockReturnDetail[] }>((acc, row) => {
      const baseUnit = row.baseUnitName || "Unknown";
      if (!acc[baseUnit]) {
        acc[baseUnit] = [];
      }
      acc[baseUnit].push(row);
      return acc;
    }, {});
  };

  // Calculate totals for a group of rows
  const calculateTotals = (rows: DistributorStockReturnDetail[]) => {
    const totals = rows.reduce(
      (totals, row) => {
          totals.totalStockUpdatePlus += row.returnQuantity || 0;
          totals.totalVolumePlus += row.volume || 0;
          totals.totalValuePlus += row.value || 0;

        return totals;
      },
      {
        totalStockUpdatePlus: 0,
        totalVolumePlus: 0,
        totalValuePlus: 0
      }
    );

    return {
      totalStockUpdatePlus: totals.totalStockUpdatePlus,
      totalVolumePlus: totals.totalVolumePlus.toFixed(3),
      totalValuePlus: totals.totalValuePlus,
    };
  };

  // Group rows by base unit
  if (!distributorStockReturnDetail) return null;
  const groupedRows = groupRowsByBaseUnit(distributorStockReturnDetail);

  return (
    <>
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
                <React.Fragment key={baseUnit}>
                  <TableRow>
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
                        label={`+${formatVolume3Decimals(Number(totals.totalVolumePlus))}`}
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
                        label={`+${formatCurrency(totals.totalValuePlus)}`}
                        size="small"
                        variant="soft"
                        color="success"
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
