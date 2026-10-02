import { Chip } from "@mui/material";

export type Status = 0 | 1 | 2;

const statusStyles = {
    0: { backgroundColor: 'rgba(108, 117, 125, 0.7)', color: 'white' },
    1: { backgroundColor: 'rgba(220, 53, 69, 0.7)', color: 'white' },
    2: { backgroundColor: 'rgba(40, 167, 69, 0.7)', color: 'white' },
};

const statusDescriptions = {
    0: 'None',
    1: 'Partial',
    2: 'Paid',
};

interface PaymentStatusChipProps {
    status: Status;
}

export const Sale_Payment_StatusChip = ({ status }: PaymentStatusChipProps) => {
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