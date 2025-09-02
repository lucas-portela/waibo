import { VisibilityOff, Visibility } from "@mui/icons-material";
import { TextField, Button } from "@mui/material";
import { useState } from "react";

export default function PasswordInput({
  label,
  id,
  value,
  onChange,
  fullWidth = true,
  required = false,
  disabled = false,
  helperText,
}: {
  label: string;
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <TextField
      id={id}
      label={label}
      type={passwordVisible ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
      helperText={helperText}
      slotProps={{
        input: {
          endAdornment: (
            <Button
              onClick={() => setPasswordVisible(!passwordVisible)}
              size="small"
              color="secondary"
            >
              {passwordVisible ? <VisibilityOff /> : <Visibility />}
            </Button>
          ),
        },
      }}
    />
  );
}
