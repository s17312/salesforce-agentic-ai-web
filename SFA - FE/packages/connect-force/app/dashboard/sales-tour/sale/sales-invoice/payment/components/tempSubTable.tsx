import { formatCurrency } from "@/utils/formatCurrency";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    marginTop: theme.spacing(2),
}));

const StyledTable = styled(Table)(({ theme }) => ({
    '& .MuiTableCell-root': {
        padding: theme.spacing(1),
    },
    '& .MuiTableHead-root': {
        backgroundColor: theme.palette.primary.light,
    },
    '& .MuiTableRow-root:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

interface PaymentDetail {
    paymentDetailUId: string;
    invoiceId: string;
    invoiceAmount: number;
    payment: number;
}

interface PaymentDetailsTableProps {
    paymentDetails: PaymentDetail[];
}

const PaymentDetailsTable = ({ paymentDetails }: PaymentDetailsTableProps) => (
    <StyledTableContainer>
        <StyledTable size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell align="center">Invoice Amount</TableCell>
                    <TableCell align="center" >Payment</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paymentDetails.map((detail) => (
                    <TableRow key={detail.paymentDetailUId}>
                        <TableCell>{detail.invoiceId}</TableCell>
                        <TableCell align="center">{formatCurrency(detail.invoiceAmount)}</TableCell>
                        <TableCell align="center">{formatCurrency(detail.payment)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </StyledTable>
    </StyledTableContainer>
);

export default PaymentDetailsTable;