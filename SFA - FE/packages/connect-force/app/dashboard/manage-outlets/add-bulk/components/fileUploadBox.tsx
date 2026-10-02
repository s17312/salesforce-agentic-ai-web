import { Box, Button, Typography, useTheme } from "@mui/material";
import {
    CloudUpload as CloudUploadIcon,
    InsertDriveFile as InsertDriveFileIcon,
} from "@mui/icons-material";

export const FileUploadBox: React.FC<{ file: File | null, handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void }> = ({ file, handleFileChange }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                border: `2px dashed ${theme.palette.primary.dark}`,
                borderRadius: 2,
                padding: 4,
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                position: "relative",
                height: 65,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
        >
            <input
                accept=".xls, .xlsx, .csv"
                style={{ display: "none" }}
                id="file-input"
                type="file"
                onChange={handleFileChange}
            />
            {!file ? (
                <label htmlFor="file-input">
                    <Box sx={{ cursor: "pointer" }}>
                        <CloudUploadIcon sx={{ fontSize: 40, color: `${theme.palette.primary.dark}` }} />
                        <Typography variant="body1" color="textSecondary">
                            Drag and Drop file here or{" "}
                            <Button
                                component="span"
                                sx={{
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                    padding: 0,
                                    minWidth: 0,
                                    color: "primary.main",
                                }}
                            >
                                Choose file
                            </Button>
                        </Typography>
                    </Box>
                </label>
            ) : (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: "#f3f5f7", p: 2, boxShadow: theme.shadows[2], borderRadius: 1 }}>
                        <InsertDriveFileIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {file.name}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};