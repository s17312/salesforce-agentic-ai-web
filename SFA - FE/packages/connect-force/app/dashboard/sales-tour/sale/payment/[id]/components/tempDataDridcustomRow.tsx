import { Box, Collapse, Typography } from "@mui/material";
import PaymentDetailsTable from "../../../sales-invoice/payment/components/tempSubTable";
import { GridRow } from "@mui/x-data-grid";

const renderRow = (props: any, expandedRows: { [key: number]: boolean }) => {
    const isExpanded = expandedRows[props.row.paymentHeader.paymentHeaderId] || false;

    return (
        <Box>
            {/* Render the default row */}
            <GridRow {...props} />

            {/* Render the expanded content */}
            <Collapse in={isExpanded}>
                <Box sx={{ padding: '16px', backgroundColor: '#ffffff' }}>
                    <Typography variant="subtitle1">Payment Details</Typography>
                    <PaymentDetailsTable paymentDetails={props.row.paymentDetail} />
                </Box>
            </Collapse>
        </Box>
    );
};

export default renderRow;