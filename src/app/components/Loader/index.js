import { Box } from '@mui/material';
import React from 'react';
import { keyframes } from '@mui/system'; // Import keyframes from MUI
import Colors  from '../../assets/styles/index';

// Define the spin animation using keyframes
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

function Loader({ width, height ,marginTop,color}) {
    return (
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", color: color }}> {/* Set color to red here */}
            <Box
                sx={{
                    display: "inline-block",
                    width: width,
                    height: height,
                    animation: `${spin} 1s linear infinite`, // Use the spin animation here
                    borderRadius: "50%",
                    borderWidth: "4px",
                    borderStyle: "solid",
                    borderColor: "currentColor",
                    borderRightColor: "transparent",
                    marginTop: marginTop,
                }}
                role="status"
            >
                <span
                    sx={{
                        position: "absolute",
                        margin: "-1px",
                        height: "1px",
                        width: "1px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        border: "0",
                        padding: "0",
                        clip: "rect(0, 0, 0, 0)",
                    }}
                ></span>
            </Box>
        </Box>
    );
}

export default Loader;
