import React, { useState } from 'react';
import './CustomSwitch.css';

interface Props {
  name: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function ActiveInactiveSwitch({ name, defaultChecked, disabled = false, onChange, ...other }: Props) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
<div className={`button r ${disabled ? 'disabled' : ''}`} id="button-1">
  <input
    type="checkbox"
    className={`checkbox ${disabled ? 'disabled' : ''}`}
    name={name}
    checked={checked}
    disabled={disabled}
    onChange={handleInputChange}
    {...other}
  />
  <div className="knobs"></div>
  <div className="layer"></div>
</div>
  );
}