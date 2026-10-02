// // form
// import { useFormContext, Controller } from 'react-hook-form'
// // @mui
// import {
//     Radio,
//     RadioGroup,
//     FormHelperText,
//     RadioGroupProps,
//     FormControlLabel,
// } from '@mui/material'

// // ----------------------------------------------------------------------

// type Props = RadioGroupProps & {
//     name: string;
//     options: {
//         label: string
//         value: any
//     }[];
// }

// export default function RHFRadioGroup({ name, options, ...other }: Props) {
//     const { control } = useFormContext()

//     return (
//         <Controller
//             name={name}
//             control={control}
//             render={({ field, fieldState: { error } }) => (
//                 <div>
//                     <RadioGroup {...field} row {...other}>
//                         {options.map((option) => (
//                             <FormControlLabel
//                                 key={option.value}
//                                 value={option.value}
//                                 control={<Radio />}
//                                 label={option.label}
//                             />
//                         ))}
//                     </RadioGroup>

//                     {!!error && (
//                         <FormHelperText error sx={{ px: 2 }}>
//                             {error.message}
//                         </FormHelperText>
//                     )}
//                 </div>
//             )}
//         />
//     )
// }

import React, { useState } from 'react';
import {
  Radio,
  RadioGroup,
  FormHelperText,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';

interface RHFRadioGroupProps {
  name: string;
  options: {
    label: string;
    value: any;
  }[];
  defaultValue?: any;
  onChange?: (value: any) => void;
  error?: string;
}

const RHFRadioGroup: React.FC<RHFRadioGroupProps> = ({
  name,
  options,
  defaultValue,
  onChange,
  error,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || '');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange && onChange(value); // Call the onChange callback if provided
  };

  return (
    <div>
      <RadioGroup name={name} value={selectedValue} onChange={handleChange} row>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>

      {error && (
        <FormHelperText error sx={{ px: 2 }}>
          {error}
        </FormHelperText>
      )}
    </div>
  );
};

export default RHFRadioGroup;
