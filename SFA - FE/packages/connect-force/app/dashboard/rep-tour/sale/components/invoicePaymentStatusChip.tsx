import { Chip } from "@mui/material";

export type Status = 1 | 2;

const statusStyles = {
    1: { backgroundColor: 'rgba(40, 167, 69, 0.7)', color: 'white' },
    2: { backgroundColor: 'rgba(220, 53, 69, 0.7)', color: 'white' },
};

const statusDescriptions = {
    1: 'Paid',
    2: 'Due',
};

interface SimpleStatusChipProps {
    status: Status;
}

export const InvoicePayment_StatusChip = ({ status }: SimpleStatusChipProps) => {
    return (
        <Chip
            label={statusDescriptions[status]}
            style={statusStyles[status]}
            size="small"
            variant="soft"
            sx={{ fontSize: '0.75rem' }}
        />
    );
};