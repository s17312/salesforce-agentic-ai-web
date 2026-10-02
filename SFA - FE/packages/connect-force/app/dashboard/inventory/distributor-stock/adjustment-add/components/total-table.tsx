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

interface TotalTableRowsProps {
  groupedRows: { [key: string]: any[] };
}

const TotalTableRows: React.FC<TotalTableRowsProps> = ({ groupedRows }) => {
   const calculateTotals = (rows: any) => {
    const totals = rows.reduce(
      (totals: any, row: any) => {
        if (row.action === "increment") {
          totals.totalStockUpdatePlus += row.stockUpdate;
          totals.totalVolumePlus += row.volume;
          totals.totalValuePlus += row.value;
        } else {
          totals.totalStockUpdateMinus += row.stockUpdate;
          totals.totalVolumeMinus += row.volume;
          totals.totalValueMinus += row.value;
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
