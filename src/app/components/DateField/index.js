import React from 'react';
import { Box, styled, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Colors from '../../assets/styles/index'; // Adjust the path as needed
// import CustomTextField from './CustomTextField'; 

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
      padding: "0px",
    margin: "0px",
    width: "151px",
      '& fieldset': {
        borderColor: 'transparent', // Remove the default border
      },
      '&:hover fieldset': {
        borderColor: 'transparent', // Remove the border on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent', // Remove the border on focus
      },
      color: Colors.black,
    },
    '& input': {
      padding: '5px 0px',
    },
    '& .MuiInputBase-input': {
      color: Colors.black,
      fontSize: '14px',
    },
  }));
export const DateField = ({
    placeholder,
    value,
    onChange
  }) => {
    console.log("🚀 ~ value:", value)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          width: "100%"
        }}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            value={value}
            onChange={onChange}
            sx={{
              "&.MuiFormControl-root": {
                width: "100%",
                "& .MuiIconButton-root": {
                  color: Colors.black, // Ensure this targets the IconButton
                },
              }
            }}
            slots={{
              openPickerIcon: ArrowDropDown,
              textField: CustomTextField,
            }}
            slotProps={{
              textField: {
                size: "small",
                placeholder: placeholder
              },
              desktopPaper: {
                sx: {
                  background: Colors.dark3,
                  color: Colors.black,
                  "& .MuiTypography-root": {
                    color: Colors.black
                  },
                  "& .MuiButtonBase-root": {
                    color: Colors.black
                  }
                }
              }
            }}
          />
        </LocalizationProvider>
      </Box>
    )
  }