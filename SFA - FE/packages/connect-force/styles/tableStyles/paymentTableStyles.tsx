import { styled, TableCell, tableCellClasses, TableRow } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: 'rgb(130, 88, 255)',
        color: theme.palette.common.black,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: theme.palette.common.black,
    },
}));

export const StyledTableHeaderRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgb(219, 212, 240)',
    },
    // Add bottom border
    '&:not(:last-child)': {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(255, 255, 248, 0.3)',
    },
    // Add bottom border
    '&:not(:last-child)': {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));