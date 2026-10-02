import { Chip } from "@mui/material";

export type Status = 0 | 12 | 13;

const statusStyles = {
    0: { backgroundColor: '#FFC107', color: '#000' },
    1: { backgroundColor: '#6c757db2', color: '#fff' },
    12: { backgroundColor: '#B02A37', color: '#fff' },
    13: { backgroundColor: '#198754', color: '#fff' },
};

const statusDescriptions = {
    0: 'Loading Pending Approval',
    1: 'Draft',
    12: 'Loading Rejected',
    13: 'Loading Accepted',
};

interface SimpleStatusChipProps {
    status: Status;
}

export const Mobile_Loading_StatusChip = ({ status }: SimpleStatusChipProps) => {
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