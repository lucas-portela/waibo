import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function SelectInput({
  label,
  id,
  value,
  onChange,
  options,
  fullWidth = true,
  required = false,
  disabled = false,
}: {
  label: string;
  id: string;
  value?: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <FormControl fullWidth={fullWidth} required={required} disabled={disabled}>
      <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-select-label`}
        id={`${id}-select`}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
