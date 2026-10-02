import { FileRejection } from 'react-dropzone'
// @mui
import { alpha } from '@mui/material/styles'
import { Box, Paper, Typography } from '@mui/material'
// utils
import { fData } from '../../../utils/formatNumber'
//
import { fileData } from '../../file-thumbnail'

// ----------------------------------------------------------------------

type Props = {
    fileRejections: readonly FileRejection[],
    isClear?: boolean
}

export default function RejectionFiles({ fileRejections, isClear }: Props) {
    if (!fileRejections.length) {
        return null
    }

    if (isClear) {
        return null
    }

    return (
        <Paper
            variant="outlined"
            sx={{
                py: 1,
                px: 2,
                mt: 3,
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                borderColor: (theme) => alpha(theme.palette.error.main, 0.24),
            }}
        >
            {fileRejections.map(({ file, errors }) => {
                const { path, size } = fileData(file)

                function logFileSizeInMB(errorMessage: string) {
                    const matchResult = errorMessage.match(/\d+/);

                    if (matchResult) {
                        const fileSizeInBytes = parseInt(matchResult[0], 10);
                        const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
                        return (`File is larger than ${fileSizeInMB.toFixed(2)} MB`)
                    } else {
                        return ("No file size found in the error message.");
                    }
                }

                return (
                    <Box key={path} sx={{ my: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                            {path} - {size ? fData(size) : ''}
                        </Typography>

                        {errors.map((error) => (
                            <Box
                                key={error.code}
                                component="span"
                                sx={{ typography: 'caption' }}
                            >
                                - {logFileSizeInMB(error.message)}
                            </Box>
                        ))}
                    </Box>
                )
            })}
        </Paper>
    )
}
