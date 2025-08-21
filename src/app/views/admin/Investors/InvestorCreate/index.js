import {
  Box,
  Grid,
  Typography,
  InputLabel,
  IconButton,
  TextField,
  Button,
  Autocomplete,
  Chip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Colors from "../../../../assets/styles";
import { useForm } from "react-hook-form";
import PropertyServices from "../../../../api/PropertyServices/property.index";
import { useNavigate } from "react-router-dom";
import { ErrorToaster, SuccessToaster } from "../../../../components/Toaster";
import { ErrorHandler } from "../../../../utils/ErrorHandler";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loader from "../../../../components/Loader";
import AuthServices from "../../../../api/AuthServices/auth.index";

// Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CreateInvestor() {
  const navigate = useNavigate();
  const scrollTimeout = useRef(null);

  const [propertyData, setPropertyData] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(100000);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  console.log(selectedProperties ,'selectedProperties')
  const createProperty = async (data) => {
    const obj = {
      name: data?.name,
      email: data?.email,
      password: data?.password,
      properties: selectedProperties?.map((property) => property._id),
    };
    setIsSubmitting(true);
    try {
      const res = await AuthServices.createInvestor(obj);
      SuccessToaster(res?.message);
      navigate("/investor/list");
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProperties = async (searchParam = "", pageParam = 1) => {
    setLoading(true);
    try {
      const { data } = await PropertyServices.getProperty(
        searchParam,
        "",
        pageParam,
        limit,"","","",""
      );
      const newProps = data?.properties || [];
      setPropertyData((prev) =>
        pageParam === 1 ? newProps : [...prev, ...newProps]
      );
    } catch (error) {
      ErrorHandler(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProperties(debouncedSearch, page ,"","","","");
  }, [debouncedSearch, page]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          mt: 9.5,
          pl: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: "26px",
            color: "rgb(148 149 153)",
            fontWeight: "600",
          }}
        >
          Investor /
        </Typography>
        <Typography
          sx={{ fontSize: "22px", color: Colors.primary, fontWeight: "600" }}
        >
          Add New
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(createProperty)}
        sx={{
          margin: "14px 16px",
          padding: "20px",
          backgroundColor: Colors.backgroundColor,
          borderRadius: "8px",
        }}
      >
        <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Investor Details
        </Typography>

        <Grid container spacing={2} mt={1.5}>
          <Grid item xs={12} md={5}>
            <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
              Investor Name
            </InputLabel>
            <TextField
              margin="normal"
              fullWidth
              {...register("name", {
                required: "Investor Name is required",
              })}
              error={!!errors.name}
              helperText={errors?.name?.message}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
              Email
            </InputLabel>
            <TextField
              type="email"
              margin="normal"
              fullWidth
              {...register("email", {
                required: "Email is required",
              })}
              error={!!errors.email}
              helperText={errors?.email?.message}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
              Password
            </InputLabel>
            <TextField
              type={showPassword ? "text" : "password"}
              margin="normal"
              fullWidth
              {...register("password", {
                required: "Password is required",
              })}
              error={!!errors.password}
              helperText={errors?.password?.message}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </Grid>

          {/* Property Autocomplete */}
          <Grid item xs={12} md={5}>
            <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
              Properties
            </InputLabel>
            <Autocomplete
  multiple
  options={propertyData || []}
  // getOptionLabel={(option) => option.name +" " +  option.unit_number || ""}
  getOptionLabel={(option) => `${option.name} (${option.unit_number || ""})`}

  filterSelectedOptions
  inputValue={search}
  value={selectedProperties}
  onInputChange={(event, newInputValue) => {
    setSearch(newInputValue);
    setPage(1);
    setPropertyData([]);
  }}
  onChange={(event, newValues) => {
    setSelectedProperties(newValues);
    setValue("features", newValues);
  }}
  loading={loading}
  ListboxProps={{
    onScroll: (event) => {
      const listboxNode = event.currentTarget;
      const scrollBottom =
        listboxNode.scrollHeight -
        listboxNode.scrollTop -
        listboxNode.clientHeight;

      if (scrollBottom < 100 && !loading) {
        if (scrollTimeout.current)
          clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          setPage((prev) => prev + 1);
        }, 1000);
      }
    },
    sx: {
      maxHeight: "200px",
      overflowY: "auto",
    },
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      margin="normal"
      fullWidth
      placeholder="Search and select properties"
      error={!!errors.features}
      helperText={errors?.features?.message}
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {loading && (
              <Loader
                width="20px"
                height="20px"
                color={Colors.primary}
              />
            )}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  )}
/>


            {/* Selected Chips */}
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedProperties.map((property, index) => (
                <Chip
                  key={property.id}
                  label={property.name}
                  onDelete={() => {
                    const updated = selectedProperties.filter(
                      (_, i) => i !== index
                    );
                    setSelectedProperties(updated);
                    setValue("features", updated);
                  }}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ color: Colors.white }}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
