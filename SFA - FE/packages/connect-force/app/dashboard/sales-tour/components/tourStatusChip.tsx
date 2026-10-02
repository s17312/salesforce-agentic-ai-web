import { Chip, Tooltip } from "@mui/material";
import SmartphoneIcon from "@mui/icons-material/Smartphone";

export type Status =
    | 1 | 2 | 3 | 4 | 5 | 6
    | 7 | 8 | 9 | 10 | 11 | 12 | 13
    | 14 | 15 | 16 | 17;

const statusDescriptions: Record<Status, string> = {
    1: "Scheduling",
    2: "Loading",
    3: "Sale",
    4: "Unloading",
    5: "Complete",
    6: "Submit",
    7: "Schedule Pending",
    8: "Mobile Loading",
    // Mobile Schedule Pending Approval
    9: "Schedule Pending Approval",
    10: "Schedule Rejected",
    11: "Schedule Accepted",
    12: "Loading Rejected",
    13: "Loading Accepted",
    14: "Mobile Sale InProgress",
    15: "Mobile Unloading",
    16: "Mobile Tour Submit",
    17: "Mobile Completed",
};

const statusStyles: Record<Status, React.CSSProperties> = {
    1: { backgroundColor: '#ffc107b2', color: 'white' },
    2: { backgroundColor: '#6e28a7b2', color: 'white' },
    3: { backgroundColor: '#007bffb2', color: 'white' },
    4: { backgroundColor: '#ff5722b2', color: 'white' },
    5: { backgroundColor: '#6c757db2', color: 'white' },
    6: { backgroundColor: '#28a745b2', color: 'white' },
    7: { backgroundColor: '#00bcd4b2', color: 'white' },
    8: { backgroundColor: '#9c27b0b2', color: 'white' },
    9: { backgroundColor: '#ff9800b2', color: 'white' },
    10: { backgroundColor: '#f44336b2', color: 'white' },
    11: { backgroundColor: '#4caf50b2', color: 'white' },
    12: { backgroundColor: '#e91e63b2', color: 'white' },
    13: { backgroundColor: '#00c853b2', color: 'white' },
    14: { backgroundColor: '#2196f3b2', color: 'white' },
    15: { backgroundColor: '#ff7043b2', color: 'white' },
    16: { backgroundColor: '#558b2fb2', color: 'white' },
    17: { backgroundColor: '#008844dd', color: 'white' },
};

interface SimpleStatusChipProps {
    status: Status;
}

export const Tour_StatusChip = ({ status }: SimpleStatusChipProps) => {
    const isMobileStatus = status > 6;

    return (
        <Tooltip title={statusDescriptions[status]} placement="right-end" arrow>
            <Chip
                label={statusDescriptions[status]}
                style={statusStyles[status]}
                icon={isMobileStatus ? <SmartphoneIcon sx={{ color: 'white' }} /> : undefined}
                size="small"
                variant="soft"
                sx={{ fontSize: '0.75rem' }}
            />
        </Tooltip>
    );
};
