import { Box, Button, Grid, Typography } from "@mui/material";
import Colors from "../../assets/styles/index";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { Fragment } from "react";

function Filter({ items, onClick }) {
  return (
    <Grid
      container
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        background: Colors.dark1,
        borderRadius: "15px"
      }}
    >
      <Grid item md={2}
        sx={{
          borderRight: `1px solid ${Colors.dark2}`
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            width: "100%",
            py: "8px"
          }}
        >
          <FilterAltIcon />
          <Typography
            sx={{
              
              color: Colors.black,
              fontSize: "14px"
            }}
          >
            Filter By
          </Typography>
        </Box>
      </Grid>
      {items && items.map((item, ind) => (
        <Fragment key={ind}>
          {item}
        </Fragment>
      ))}
      <Grid item md={2}>
        <Button
          sx={{
            textTransform: "capitalize",
            minWidth: "100%",
            gap: 1
          }}
          onClick={onClick}
        >
          <RestoreIcon />
          <Typography
            sx={{
              
              color: Colors.primary,
              fontSize: "14px"
            }}
          >
            Reset Filter
          </Typography>
        </Button>
      </Grid>
    </Grid>
  )
}

export default Filter;