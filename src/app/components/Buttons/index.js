import { Box, Button, Typography } from "@mui/material"
import Colors from "../../assets/styles"

export const PrimaryButton = ({ title, icon, onClick, type }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        textTransform: "capitalize",
        p: "10px 20px",
        borderWidth: "2px",
        ":hover": {
          borderWidth: "2px"
        }
      }}
      onClick={onClick}
      type={type}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px"
        }}
      >
        <Typography
          sx={{
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
        {icon && icon}
      </Box>
    </Button>
  )
}

export const SecondaryButton = ({ title, icon, onClick, type }) => {
  return (
    <Button
      variant="contained"
      sx={{
        textTransform: "capitalize",
        p: "10px 20px",
        border: `1px solid ${Colors.primary}`,
        ":hover": {
          border: `1px solid ${Colors.primary}`,
        }
      }}
      onClick={onClick}
      type={type}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px"
        }}
      >
        <Typography
          sx={{
            color: Colors.white,
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
        {icon && icon}
      </Box>
    </Button>
  )
}