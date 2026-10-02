import { Chip } from "@mui/material";

export type Status = 0 | 1 | 2;

const statusStyles = {
    0: { backgroundColor: 'rgba(108, 117, 125, 0.7)', color: 'white' },
    1: { backgroundColor: 'rgba(40, 167, 69, 0.7)', color: 'white' },
    2: { backgroundColor: 'rgba(220, 53, 69, 0.7)', color: 'white' },
};

const statusDescriptions = {
    0: 'Saved',
    1: 'Submitted',
    2: 'Deleted',
};

interface SimpleStatusChipProps {
    status: Status;
}

export const Loading_StatusChip = ({ status }: SimpleStatusChipProps) => {
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