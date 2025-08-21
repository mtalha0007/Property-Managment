import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  Box,
  Select,
  Typography,
  Button,
  MenuItem,
  TablePagination,
  Avatar,
  TextField,
  Grid,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/system";

import Colors from "../../../assets/styles";
import { Svgs } from "../../../assets/images";
import { useNavigate } from "react-router-dom";
import PropertyServices from "../../../api/PropertyServices/property.index";
import { ErrorHandler } from "../../../utils/ErrorHandler";
import SimpleDialog from "../../../components/Dialog/index";
import Loader from "../../../components/Loader";
import AuthServices from "../../../api/AuthServices/auth.index";

const tableHead = [
  "SR No",
  "Agent Name",
  "Email",
  "Address",
  "Phone Number",
  
  "Action",
];

const CustomSelect = styled(Select)({
  "&.MuiSelect-root": {
    border: "none",
    outline: "none",
    boxShadow: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-icon": {
    color: "black",
  },
  "& .MuiSelect-select": {
    padding: "8px 32px 8px 8px",
  },
});

const App = () => {
  const [data, setData] = useState([]);
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const sleep = () => new Promise((r) => setTimeout(r, 1000));

  const getAgentList = async (
    searchParam = "",
    
    pageParam = 1,
    limitParam = 10,
    
  ) => {
    setLoading(true);
    try {
      await sleep();
      const { data } = await AuthServices.agentList(
        searchParam,
        
        pageParam,
        limitParam,
        "approved"
        
      );
      setData(data?.agents);
      setCount(data.count);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAgentList(search, page + 1, limit,"approved");
  }, [page, limit, search]);

  const deleteProperty = async () => {
    setDeleteLoading(true);
    try {
      const { responseCode } = await AuthServices.agentDelete(
        selectedPropertyId
      );

      setOpenDialog(false);
      getAgentList(search, page + 1, limit,"approved");
    } catch (error) {
      ErrorHandler(error);
      console.log(error?.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = () => {
    getAgentList(search, 1, limit,"approved");
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setId("");
    setSearch("");
    getAgentList("", 1, limit,"approved");
  };

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography
          sx={{ fontSize: "26px", color: Colors.primary, fontWeight: "600" }}
        >
          Agents
        </Typography>
        {/* <Button
          onClick={() => navigate("/properties/create")}
          variant="contained"
          color="primary"
          sx={{ mx: 1, color: "white" }}
        >
          Add New
        </Button> */}
      </Box>
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "20px",
        }}
      >
        <Grid
          item
          display="flex"
          alignItems="center"
          sx={{ mt: 3, pl: 2 }}
          bgcolor={Colors.backgroundColor}
          border="1px solid rgba(10, 10, 10, 0.1)"
          borderRadius={2}
          boxShadow="0xp 0px 100px 0xp rgba(0,0,0,0.1)"
        >
          <FilterAltIcon />
          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <Box sx={{ px: 2, width: "100px" }}>Filter By</Box>

          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <TextField
            placeholder="Search"
            InputProps={{
              sx: {
                input: {
                  paddingTop: "7px !important",
                  paddingBottom: "7px !important",
                  paddingRight: "50px !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Box
            sx={{
              width: "1px",
              height: "40px",
              backgroundColor: "lightgray",
              mx: 1,
            }}
          />
          <Button
            sx={{ color: Colors.red, mx: 1 }}
            startIcon={<RestoreIcon />}
            onClick={handleReset}
          >
            Reset Filter
          </Button>
        </Grid>
      </Grid>
      <TableContainer
        sx={{
          mt: 2,
          backgroundColor: Colors.backgroundColor,
          borderRadius: "10px",
        }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              {tableHead.map((column, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "600",
                    color: Colors.black,
                    textAlign:
                      column === "Management Company" ? "left" : "center",
                  }}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {loading ? (
            <TableRow>
              <TableCell colSpan={tableHead.length}>
                <Loader width="40px" height="40px" color={Colors.primary} />
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((row, index) => (
              <TableBody key={row._id}>
                <TableRow
                 onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/agent/detail/${row._id}`);
                }}
                >
                  <TableCell sx={{ textAlign: "center" }}>
                    {index + 1}
                  </TableCell>
                 
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.email}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.address }
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row?.phone}
                  </TableCell>
                 
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                     
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDialog(true);
                          setSelectedPropertyId(row._id);
                        }}
                        dangerouslySetInnerHTML={{ __html: Svgs["delete"] }}
                      />
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))
          )}
        </Table>
      </TableContainer>
      <SimpleDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        border={`4px solid ${Colors.primary}`}
        title="Are You Sure you want to Delete?"
      >
        <Box
          sx={{ display: "flex", justifyContent: "center", gap: "16px", mt: 5 }}
        >
          <Box
            onClick={() => setOpenDialog(false)}
            sx={{
              background: Colors.black,
              color: Colors.primary,
              borderRadius: "10px",
              px: 5,
              py: 2,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            No, Cancel
          </Box>
          <Box
            sx={{
              color: Colors.black,
              background: Colors.primary,
              borderRadius: "10px",
              px: 5,
              py: 2,
              fontWeight: "bold",
              cursor: "pointer",
              width:deleteLoading ? "80px":"auto"
            }}
            onClick={deleteProperty}
          >
            {deleteLoading ? (
              <Loader width="20px" height="20px"  color={Colors.white} />
            ) : (
              "Yes, Confirm"
            )}
          </Box>
        </Box>
      </SimpleDialog>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: "text.secondary", ml: 2 }}>
          {`Showing ${page * limit + 1}-${Math.min(
            (page + 1) * limit,
            count
          )} of ${count}`}
        </Typography>
        <Box>
          <TablePagination
            component={Paper}
            sx={{
              borderBottom: "none",
              border: "1px solid black",
              bgcolor: "transparent",
              ".MuiTablePagination-toolbar": {
                paddingLeft: 0,
              },
              ".MuiTablePagination-spacer": {
                flex: "none",
              },
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
                {
                  display: "none",
                },
              ".MuiTablePagination-actions": {
                marginLeft: 0,
              },
              ".MuiTablePagination-actions button:first-child": {
                borderRadius: 0,
                p: 0,
                pr: "8px",
                borderRight: "1px solid black",
              },
              ".css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar .MuiTablePagination-actions":
                {
                  marginLeft: "14px !important",
                },
              ".MuiTablePagination-toolbar": {
                minHeight: "14px !important",
                padding: "0px !important",
              },
            }}
            rowsPerPageOptions={[]} // Removes rows per page selector
            count={count}
            rowsPerPage={limit}
            page={page}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
