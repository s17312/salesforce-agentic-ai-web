import { Chip } from "@mui/material";

export type Status = 'Pending' | 'Submitted' | 'Deleted';

const statusStyles = {
    Pending: { backgroundColor: 'rgba(255, 165, 0, 0.7)', color: 'white' }, // Orange with 70% opacity
    Submitted: { backgroundColor: 'rgba(0, 128, 0, 0.7)', color: 'white' }, // Green with 70% opacity
    Deleted: { backgroundColor: 'rgba(255, 0, 0, 0.7)', color: 'white' }, // Red with 70% opacity
};

export const SimpleStatusChip = ({ status }: { status: Status }) => {
    return (
        <Chip
            label={status}
            style={statusStyles[status]}
            size="small"
            variant="soft"
            sx={{ fontSize: '0.75rem' }}
        />
    );
};