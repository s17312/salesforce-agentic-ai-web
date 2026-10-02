import React from 'react';
import { Box, Button, Card, CardContent, Divider, Grid, Typography, useTheme } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import { Control, useForm, useWatch } from "react-hook-form";
import RHFAutocompleteMultipleField from "@/components/hook-form/RHSAutocompleteMultipleField";
import { RHFAutocompleteField } from "@/components/hook-form";

interface CompanyStockFormProps {
    companiesOptions: Array<{ label: string; value: string }>;
    warehousesOptions: Array<{ label: string; value: string }>;
    productCategoriesOptions: Array<{ label: string; value: string }>;
    productGroupsOptions: Array<{ label: string; value: string }>;
    productsOptions: Array<{ label: string; value: string }>;
    handleReset: () => void;
    handleSearch: () => void;
    control: Control;
    isCompanySelected: boolean;
    setIsCompanySelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompanyStockForm: React.FC<CompanyStockFormProps> = ({
    companiesOptions,
    warehousesOptions,
    productCategoriesOptions,
    productGroupsOptions,
    productsOptions,
    handleReset,
    handleSearch,
    control,
    isCompanySelected,
    setIsCompanySelected }) => {

    const theme = useTheme();

    return (
        <Card sx={{ backgroundColor: "#fff", mb: 2 }}>
            <CardContent>
                <Box sx={{ width: '100%' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold', color: theme.palette.primary.main }}>
                        Company Stock Information
                    </Typography>
                    <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={3}>
                            <RHFAutocompleteField
                                name="companyUId"
                                placeholder="Company*"
                                options={companiesOptions}
                                control={control}
                                onChange={() => setIsCompanySelected(false)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <RHFAutocompleteMultipleField
                                name="warehouseUId"
                                placeholder="Warehouse"
                                // @ts-ignore
                                options={warehousesOptions}
                                control={control}
                                disabled={isCompanySelected}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <RHFAutocompleteMultipleField
                                name="productCategotiesUId"
                                placeholder="Product Category"
                                // @ts-ignore
                                options={productCategoriesOptions}
                                control={control}
                                disabled={isCompanySelected}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <RHFAutocompleteMultipleField
                                name="productGroupsUId"
                                placeholder="Product Group"
                                // @ts-ignore
                                options={productGroupsOptions}
                                control={control}
                                disabled={isCompanySelected}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <RHFAutocompleteMultipleField
                                name="productUId"
                                placeholder="Product"
                                // @ts-ignore
                                options={productsOptions}
                                control={control}
                                disabled={isCompanySelected}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: "#e8eaef", mt: 1, mb: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Button variant="outlined" onClick={handleReset} startIcon={<RestartAltIcon />}>
                            Reset
                        </Button>
                        <Button variant="contained" onClick={handleSearch} sx={{ ml: 1 }} startIcon={<SearchIcon />}>
                            Search
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CompanyStockForm;