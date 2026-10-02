import React from "react";
import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { formatCurrency } from "@/utils/formatCurrency";

interface TotalSalesTableProps {
    totalSale: number;
    totalUnits: number;
    totalSalesValueTable: number;
}

const TotalSalesTable: React.FC<TotalSalesTableProps> = ({ totalSale, totalUnits, totalSalesValueTable }) => {
    return (
        <>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#F3EFFF" }}>
                            <TableCell align="right" sx={{ minWidth: 100 }}>
                                <Typography fontSize={13} color="textSecondary">
                                    <strong>Total Sale</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ minWidth: 120 }}>
                                <Typography fontSize={13} color="textSecondary">
                                    <strong>Total Units</strong>
                                </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ minWidth: 120 }}>
                                <Typography fontSize={13} color="textSecondary">
                                    <strong>Total Sale Value</strong>
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align="right">
                                <Chip
                                    label={totalSale}
                                    size="small"
                                    variant="soft"
                                    color="success"
                                    sx={{ borderRadius: 1 }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Chip
                                    label={totalUnits}
                                    size="small"
                                    variant="soft"
                                    color="success"
                                    sx={{ borderRadius: 1 }}
                                />
                            </TableCell>
                            <TableCell align="right">
                                <Chip
                                    label={formatCurrency(totalSalesValueTable)}
                                    size="small"
                                    variant="soft"
                                    color="success"
                                    sx={{ borderRadius: 1 }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default TotalSalesTable;
