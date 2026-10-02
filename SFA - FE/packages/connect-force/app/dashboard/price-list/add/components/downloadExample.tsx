import { Box, Button, Paper, Typography } from "@mui/material";
import { ExcelIcon } from "@/assets/icons/price-list/excel";
import {DownloadRounded as DownloadRoundedIcon} from "@mui/icons-material";

export const DownloadExample: React.FC = () => (
    <Paper sx={{ p: 2, mt: 2, display: 'flex', alignItems: 'center', backgroundColor: '#f3f5f7' }}>
        <ExcelIcon />
        <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Typography variant="body1" component="div" color="primary">
                Table Example
            </Typography>
            <Typography variant="body2" color="#a2abb9">
                You can download the attached example and use it as a starting point for your own file.
            </Typography>
        </Box>
        <a href="/assets/samplePricelist.csv" download="samplePricelist.csv" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" sx={{ ml: 2 }} endIcon={<DownloadRoundedIcon />}>
                Download
            </Button>
        </a>
    </Paper>
);
