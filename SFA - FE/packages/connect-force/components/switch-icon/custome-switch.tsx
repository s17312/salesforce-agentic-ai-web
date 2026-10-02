import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { Grid } from "@mui/material";
import { public_sanse } from "@/app/dashboard/font";

interface CustomSwitchProps {
  text: string | boolean;
  active: boolean | undefined;
  onChange: (newState: boolean) => void;
}

const CustomSwitch = (props: CustomSwitchProps) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>(props.active);
  const [name, setName] = useState(props.text);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChecked(props.active);
  }, [props.active]);

  let newState = isChecked;

  const handleChange = () => {
    setIsChanged(true);
    newState = !isChecked;
    setName(newState ? "Active" : "Inactive");
    setIsChecked(newState);
  };

  if (isChanged) {
    props.onChange(newState as boolean);
  } else {
    props.onChange(isChecked as boolean);
  }

  return (
    <>
      <Grid
        container
        direction="row"
        alignItems="center"
        className={`${public_sanse.className}`}
      >
        <Grid item>
          <span>Status : {name}</span>
        </Grid>
        <Grid item>
          <Switch checked={isChecked} onChange={handleChange} color="primary" />
        </Grid>
      </Grid>
    </>
  );
};

export default CustomSwitch;
