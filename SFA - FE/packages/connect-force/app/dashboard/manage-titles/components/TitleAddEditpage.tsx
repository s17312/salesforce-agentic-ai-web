import { useEffect, useMemo, useState } from 'react'

import { Accordion, AccordionSummary, Box, Button, Card, Container, Grid, TextField, Typography } from "@mui/material"
import { LoadingButton } from '@mui/lab'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import FormProvider from '@/components/hook-form/FormProvider'
import { RHFTextField } from '@/components/hook-form'
import { titleValidationSchema } from '@/utils/schemas/titleSchema'
import { Title, TitleFormValuesProps } from '../../../../types/title-types'
import { createTitle, updateTitle } from '@/service/titles.service'
import { useSnackbar } from '../../../../components/snackbar'
import { PATH_DASHBOARD } from '../../../../routes/paths'
import { useRouter } from 'next/navigation'
import { SaveIcon } from '@/components/icons/saveIcon'
import { cursorDefault } from "@/styles/pageLayoutStyles/pageLayoutStyles";

type Props = {
    currentTitle?: Title | undefined;
    isEdit?: boolean;
};

export default function TitleAddForm({ currentTitle, isEdit = false }: Props) {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(true);
    const defaultValues = useMemo(
        () => ({
            description: currentTitle?.description || "",
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentTitle]
    );

    useEffect(() => {
        if (isEdit && currentTitle) {
          reset(defaultValues);
        }
        if (!isEdit) {
          reset(defaultValues);
        }
      }, [isEdit, currentTitle]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    
                ]);
            } catch (error) {
                console.error("Error in getting data", error);
            }
        };
        fetchData();
    }, []);

    const methods = useForm<TitleFormValuesProps>({
        // @ts-ignore
        resolver: yupResolver(titleValidationSchema),
        defaultValues,
        mode: 'all'
    });

    const { handleSubmit, reset, formState, setValue } = methods;

    const handleCreateTitle = async (data: TitleFormValuesProps) => {
      await createTitle(data);
      enqueueSnackbar("Create success!", { variant: "success" });
      reset(defaultValues);
      router.push(PATH_DASHBOARD.title.list);
    };

    const handleUpdateTitle = async (data: TitleFormValuesProps) => {
      await updateTitle(currentTitle?.uId, data);
      enqueueSnackbar("Update success!", { variant: "success" });
      router.push(PATH_DASHBOARD.title.list);
    };

    const handleCancel = () => {
        router.push(PATH_DASHBOARD.title.list)
    };

    return (
        <FormProvider
        methods={methods}
        onSubmit={
          !isEdit
            ? handleSubmit(handleCreateTitle)
            : handleSubmit(handleUpdateTitle)
        }
      >
            <Grid item xs={12} sx={{ mb: 3, position: 'relative' }}>
                {/* Title details */}
                <Accordion
          expanded={true}
          sx={{
            mb: 2,
            border: "1px solid #BDC1E4",
            borderRadius: "9px",
          }}
        >
          <AccordionSummary
            aria-controls="Business Category Creation"
            id="panel1a-header"
            sx={cursorDefault}
          >
                        <Typography variant='body1' sx={{ ml: 3, fontWeight: 500 }}>
                            Title Details
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
                        <RHFTextField name="description" label="Description*" />
                        
                    </Box>

                </Accordion>

                {/* owner details */}
                
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