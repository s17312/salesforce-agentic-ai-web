import { Chip } from "@mui/material";

// 7	Pending GRN
// 8	GRN Approved
// 9	GRN Rejected
export type Status = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const statusStyles = {
    1: { backgroundColor: 'rgba(128, 128, 128, 0.7)', color: 'white' },
    2: { backgroundColor: 'rgba(0, 128, 0, 0.7)', color: 'white' },
    3: { backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white' },
    4: { backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white' },
    5: { backgroundColor: 'rgba(255, 165, 0, 0.7)', color: 'white' },
    6: { backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white' },
    7: { backgroundColor: 'rgba(255, 165, 0, 0.7)', color: 'white' },
    8: { backgroundColor: 'rgba(0, 128, 0, 0.7)', color: 'white' },
    9: { backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white' },
};

const statusDescriptions = {
    1: 'Draft',
    2: 'Created',
    3: 'Deleted',
    4: 'Full Deleted',
    5: 'Prtial Deleted',
    6: 'Rejected ',
    7: 'Pending',
    8: 'Approved',
    9: 'Rejected',
};

interface SimpleStatusChipProps {
    status: Status;
}

export const PO_StatusChip = ({ status }: SimpleStatusChipProps) => {
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