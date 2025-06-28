import React from 'react'
import { IconButton, TextField } from "@mui/material";
import Colors from '../../assets/styles';

function InputField({ label, register, type, icon, onClick, fullWidth }) {
  return (
    <TextField
      fullWidth={fullWidth}
      sx={{
        "& fieldset": {
          borderColor: Colors.textColor1
        }
      }}
      variant={"outlined"}
      label={label}
      type={type}
      {...register}
      InputLabelProps={{
        sx: {
          color: Colors.textColor1
        }
      }}
      InputProps={{
        sx: {
          color: Colors.textColor1,
        },
        endAdornment: icon &&
          (
            <IconButton onClick={onClick}>
              {icon}
            </IconButton>
          )
      }}
    />
  )
}

export default InputField;