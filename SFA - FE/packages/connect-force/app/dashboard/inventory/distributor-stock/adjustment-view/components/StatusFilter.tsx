import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

interface StatusFilterProps {
    status: string;
    onStatusChange: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ status, onStatusChange }) => {
    return (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                label="Status"
            >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Submitted">Submitted</MenuItem>
                <MenuItem value="Deleted">Deleted</MenuItem>
            </Select>
        </FormControl>
    );
};

export default StatusFilter;