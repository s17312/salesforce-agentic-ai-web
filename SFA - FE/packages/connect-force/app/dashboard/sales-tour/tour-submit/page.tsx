"use client";

import FormProvider, { RHFTextField } from "@/components/hook-form";
import { PATH_DASHBOARD } from "@/routes/paths";
import {
  updateEndMileage,
  updateTourScheduleStatusComplete,
} from "@/service/tour-service/tourSchedule.service";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";

interface TourSubmitProps {
  schedule: any;
}

const TourSubmitRepTour: React.FC<TourSubmitProps> = ({ schedule }) => {
  const theme = useTheme();
  const router = useRouter();
  const [expand1, setExpand1] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tourSubmitValidationSchema = Yup.object().shape({
    endMilage: Yup.string()
      .nullable()
      .matches(/^\d*$/, "Invalid input! Only numbers are allowed")
      .test(
        "no-leading-space",
        "Invalid input! Leading spaces are not allowed",
        (value) => {
          if (!value) return true;
          return !/^\s/.test(value);
        }
      )
      .test("max-mileage", "Must be at most 5,000,000", (value) => {
        if (!value) return true;
        return parseInt(value, 10) <= 5000000;
      })
      .test(
        "min-mileage",
        "End Mileage must be greater than or equal to Start Mileage",
        function (value) {
          const { startMilage } = this.parent;
          if (!value || !startMilage) return true;
          return parseInt(value, 10) >= parseInt(startMilage, 10);
        }
      ),
  });

  const methods = useForm<any>({
    mode: "all",
    defaultValues: {
      startMilage: schedule?.startMilage || "",
      repEndMileage: schedule?.repEndMileage || "",
      endMilage: schedule?.endMilage || 0,
    },
    resolver: yupResolver(tourSubmitValidationSchema),
  });

  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = methods;

  useWatch({
    control,
    name: ["endMilage"],
  });

  const startMilage = schedule?.startMilage;
  const repEndMileage = schedule?.repEndMileage;
  const endMilage = getValues("endMilage");
  let totalMileage = endMilage - startMilage;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const resEndMileage = await updateEndMileage(schedule.uId, {
      statusUId: 6,
      endMileage: endMilage,
      repMileage: repEndMileage,
    });
    setIsSubmitting(false);
    enqueueSnackbar(resEndMileage, { variant: "success" });
    router.push(PATH_DASHBOARD.salesTour.salesTour);
  };

  return (
    <FormProvider methods={methods}>
      <Accordion
        expanded={expand1}
        onChange={() => setExpand1(!expand1)}
        sx={{
          mb: 2,
          borderRadius: "9px",
          backgroundColor: "white",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            flexDirection: "row-reverse",
            alignItems: "center",
            borderTopLeftRadius: "9px",
            borderTopRightRadius: "9px",
            borderBottomLeftRadius: expand1 ? "0px" : "9px",
            borderBottomRightRadius: expand1 ? "0px" : "9px",
            backgroundColor: "white",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: theme.palette.primary.main,
              ml: 1,
            }}
          >
            Tour Submit Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: "white",
            borderTopLeftRadius: expand1 ? "0px" : "9px",
            borderTopRightRadius: expand1 ? "0px" : "9px",
            borderBottomLeftRadius: "9px",
            borderBottomRightRadius: "9px",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Divider sx={{ borderColor: "#e8eaef", mt: 0.5, mb: 2 }} />
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ mb: 2, alignItems: "stretch" }}
            >
              <Grid item xs={3}>
                <RHFTextField
                  name="startMilage"
                  label="Start Mileage"
                  InputLabelProps={
                    startMilage ? { shrink: true } : { shrink: false }
                  }
                  inputProps={{ readOnly: true }}
                  value={startMilage}
                />
              </Grid>
              {schedule.isMobile && (
                <Grid item xs={3}>
                  <RHFTextField
                    name="repEndMileage"
                    label="Rep End Mileage"
                    InputLabelProps={
                      startMilage ? { shrink: true } : { shrink: false }
                    }
                    inputProps={{ readOnly: true }}
                    value={repEndMileage}
                  />
                </Grid>
              )}
              <Grid item xs={3}>
                <RHFTextField
                  name="endMilage"
                  label="Distributor End Mileage"
                  type="number"
                  disabled={schedule?.statusUId === 6}
                // onChange={(e) => {
                //   let newValue = e.target.value;
                //   newValue = newValue.replace(/\D/g, "");
                //   setValue("endMilage", newValue, { shouldValidate: true });
                //   trigger("endMilage");
                // }}
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name="totalMileage"
                  label="Total Mileage"
                  disabled
                  value={totalMileage < 0 ? "Enter End Mileage" : totalMileage}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <LoadingButton
                  variant="contained"
                  loading={isSubmitting}
                  onClick={handleSubmit}
                  disabled={
                    !endMilage ||
                    !!errors.endMilage ||
                    schedule.statusUId === 6
                  }
                >
                  End Tour
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </FormProvider>
  );
};

export default TourSubmitRepTour;
