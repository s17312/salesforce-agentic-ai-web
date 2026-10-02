import { Chip } from "@mui/material";

export type Status = 1 | 2 | 3 | 4 | 5 | 6;

const statusStyles = {
    1: { backgroundColor: 'rgba(255, 193, 7, 0.7)', color: 'white' }, // Scheduling - Amber
    2: { backgroundColor: 'rgba(0, 123, 255, 0.7)', color: 'white' }, // Loading - Blue
    3: { backgroundColor: 'rgba(127, 40, 167, 0.7)', color: 'white' }, // Sale - Green
    4: { backgroundColor: 'rgba(255, 87, 34, 0.7)', color: 'white' }, // Unloading - Deep Orange
    5: { backgroundColor: 'rgba(108, 117, 125, 0.7)', color: 'white' }, // Pending Submit - Gray
    6: { backgroundColor: 'rgba(40, 167, 69, 0.7)', color: 'white' }, // Completed - Red
};

const statusDescriptions = {
    1: 'Scheduling',
    2: 'Loading',
    3: 'Sale',
    4: 'Unloading',
    5: 'Pending Submit',
    6: 'Completed',
};

interface SimpleStatusChipProps {
    status: Status;
}

export const Tour_StatusChip = ({ status }: SimpleStatusChipProps) => {
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