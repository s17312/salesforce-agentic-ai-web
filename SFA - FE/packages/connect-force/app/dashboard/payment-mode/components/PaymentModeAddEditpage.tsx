import { useEffect, useMemo, useState } from 'react'
import { Accordion, AccordionSummary, Box, Button, Grid, Typography } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider from '@/components/hook-form/FormProvider'
import { RHFTextField } from '@/components/hook-form'
import { PaymentMode, FormValuesPropPaymentMode as FormValuesProps } from "connect-force-api-client/models/payment-mode";
import { createPaymentModes, updatePaymentMode } from '@/service/paymentMode.service'
import { useSnackbar } from '../../../../components/snackbar'
import { PATH_DASHBOARD } from '../../../../routes/paths'
import { useRouter } from 'next/navigation'
import { SaveIcon } from '@/components/icons/saveIcon'
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";
import { paymentModeValidationSchema } from '@/utils/schemas/paymentModeSchema'

type Props = {
    currentPaymentMode?: PaymentMode | undefined;
    isEdit?: boolean;
};

export default function PaymentModeAddForm({ currentPaymentMode, isEdit = false }: Props) {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar();
    const defaultValues = useMemo(
        () => ({
            description: currentPaymentMode?.description || "",
            paymentModeId: currentPaymentMode?.paymentModeId || "",
            paymentModeType: currentPaymentMode?.paymentModeType || "",
        }),
        [currentPaymentMode]
    );

    useEffect(() => {
        if (isEdit && currentPaymentMode) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentPaymentMode]);

    const methods = useForm<FormValuesProps>({
        //@ts-ignore
        resolver: yupResolver(paymentModeValidationSchema),
        defaultValues,
        mode: 'all'
    });

    const { handleSubmit, reset, formState } = methods;

    const handleCreatePaymentMode = async (data: FormValuesProps) => {
      await createPaymentModes(data);
      enqueueSnackbar("Create success!", { variant: "success" });
      reset(defaultValues);
      router.push(PATH_DASHBOARD.paymentMode.list);
    };

    const handleUpdatePaymentMode = async (data: FormValuesProps) => {
      await updatePaymentMode(currentPaymentMode?.uId, data);
      enqueueSnackbar("Update success!", { variant: "success" });
      router.push(PATH_DASHBOARD.paymentMode.list);
    };

    const handleCancel = () => {
        router.push(PATH_DASHBOARD.paymentMode.list)
    };

    return (
        <FormProvider
            methods={methods}
            onSubmit={
                !isEdit
                    ? handleSubmit(handleCreatePaymentMode)
                    : handleSubmit(handleUpdatePaymentMode)
            }
        >
            <Grid item xs={12} sx={{ mb: 3, position: 'relative' }}>
                <Accordion
                    expanded={true}
                    sx={{
                        mb: 2,
                        border: "1px solid #BDC1E4",
                        borderRadius: "9px",
                    }}
                >
                    <AccordionSummary
                        aria-controls="Payment Mode Creation"
                        id="panel1a-header"
                        sx={cursorDefault}
                    >
                        <Typography variant='body1' sx={{ ml: 3, fontWeight: 500 }}>
                            Payment Mode Details
                        </Typography>
                    </AccordionSummary>

                    <Box
                        sx={{ mx: 12, mb: 3 }}
                        rowGap={2}
                        columnGap={2}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                        }}
                    >
                        <RHFTextField name="paymentModeId" label="Code*" />
                        <RHFTextField name="paymentModeType" label="Type*" />
                        <RHFTextField name="description" label="Description" />
                    </Box>
                </Accordion>

                <Box
                    sx={{
                        width: "100%",
                        bgcolor: "#E5E0F5",
                        height: "10vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "2px solid #FFFFFF",
                        borderRadius: "15px",
                        mt: "15px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={formState.isSubmitting}
                            startIcon={<SaveIcon />}
                            disabled={!formState.isDirty}
                            sx={{
                                color: "#FFFFFF",
                                height: "44px",
                                px: 4,
                                borderRadius: "15px",
                                mr: 3,
                                border: "2px solid #9fa4d4",
                                background: "#070E4D",
                                "&:hover": {
                                    background: "#2D3675",
                                },
                            }}
                        >
                            {isEdit ? "Update" : "Save"}
                        </LoadingButton>
                        {!isEdit ? (
                            <Button
                                type="reset"
                                variant="outlined"
                                onClick={() => reset(defaultValues)}
                                sx={{
                                    height: "44px",
                                    px: 4,
                                    borderRadius: "15px",
                                    background: "#f7f4fe",
                                    border: "2px solid #fbf9ff",
                                    "&:hover": {
                                        background: "#DED8F2",
                                        border: "2px solid #f4f1fc",
                                    },
                                }}
                            >
                                Clear
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{
                                    height: "44px",
                                    px: 4,
                                    borderRadius: "15px",
                                    background: "#f7f4fe",
                                    border: "2px solid #fbf9ff",
                                    "&:hover": {
                                        background: "#DED8F2",
                                        border: "2px solid #f4f1fc",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                    </Box>
                </Box>
            </Grid>
        </FormProvider>
    );
};
