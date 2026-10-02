'use client';

import { RHFAutocompleteField, RHFTextField } from "@/components/hook-form";
import React from "react";
import { Box, Card, CardContent, Divider, Grid, Typography, useTheme } from "@mui/material";
import { Control } from "react-hook-form";

interface CsAdjustmentFormProps {
    CS_AdjustmentId: string | number | null;
    control:Control;
};

const CsAdjustmentForm: React.FC<CsAdjustmentFormProps> = ({
    CS_AdjustmentId,
    control
}) => {

    const theme = useTheme();

    return (
        <Card sx={{ backgroundColor: "#fff", mb: 2 }}>
            <CardContent>
                <Box sx={{ width: '100%' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Company Stock Adjustment Information
                    </Typography>
                    <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={3}>
                            <RHFTextField defaultValue={'sdsdsd'} name="stockAdjustmentNo" label="Stock Adjustment ID*" />
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>

        </Card>
    );
};

export default CsAdjustmentForm;
