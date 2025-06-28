import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Grid,
  Avatar,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  ClickAwayListener,
  Paper,
  Chip,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Input,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import Colors from "../../../../../assets/styles";
import styled from "@emotion/styled";
import { Svgs } from "../../../../../assets/images";
import { ErrorHandler } from "../../../../../utils/ErrorHandler";
import SkillServices from "../../../../../api/SkillServices/skill.index";
import FileServices from "../../../../../api/FileServices/file.index";
import {
  ErrorToaster,
  SuccessToaster,
} from "../../../../../components/Toaster/index";
import EmployeeServices from "../../../../../api/EmployeeServices/employee.index";
import PropertyServices from "../../../../../api/PropertyServices/property.index";
import CompanyServices from "../../../../../api/CompanyServices/company.index";
import JobServices from "../../../../../api/JobServices/job.index";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
const steps = [
  "Job info",
  "Skill and Experience",
  "Job Preference",
  "Additional Details",
];
// const restrictedPlaces = ["Dubai Iconic Tower", "Aewari Tower", "Huwai Town"];

const EmployeeForm = () => {
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState("");
  const [limit, setLimit] = useState(10);
  const [experience, setExperience] = useState("0-1");
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [area, setArea] = useState("");
  const [jobType, setJobType] = useState("");
  // const [jobType1, setJobType1] = useState("");
  const [selectedChips, setSelectedChips] = useState([]);
  const [selectedDrugChips, setSelectedDrugChips] = useState([]);
  const [billingual, setBillingual] = useState("");
  const [drivingLicense, setDrivingLicense] = useState(false);
  const [multiInputValue, setMultiInputValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [form1, setForm1] = useState({});
  const [form2, setForm2] = useState({});
  const [form3, setForm3] = useState({});
  const [form4, setForm4] = useState({});
  const [selectedSkillTypeChip, setSelectedSkillTypeChip] = useState([]);
  const [skillsData, setSkillsData] = useState({});
  const [fileURL, setFileURL] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [language, setLanguage] = useState("English");
  const [hovered, setHovered] = useState(false);
  const [drug, setDrug] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [property, setProperty] = useState([]);
  const [managmentCompany, setManagmentCompany] = useState([]);
  const [codesData, setCodesData] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [managmentCompanyData, setManagmentCompanyData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [usersSearch, setUsersSearch] = useState("");
  const navigate = useNavigate();

  console.log(propertyData);
  const [tempWork, setTempWork] = useState({
    workOnSameDay: false,
    callAfterHour: false,
    workWeekends: false,
    haveTransportation: false,
    willTravel: false,
    willWorkOnBraunfels: false,
    willWorkOnBorene: false,
  });
  const [directHire, setDirectHire] = useState({
    callAfterHour: false,
    workWeekends: false,
    insurance: false,
    liveOnSite: false,
    relocate: false,
  });
  const baseUrl = process.env.REACT_APP_BASE_URL;
  //for file

  // handle Chip state

  const handleTempState = (field) => (e) => {
    setTempWork((prevTempWork) => ({
      ...prevTempWork,
      [field]: e.target.value,
    }));
  };
  const handleDirecdHireState = (field) => (e) => {
    setDirectHire((prevTempWork) => ({
      ...prevTempWork,
      [field]: e.target.value,
    }));
  };
  const handleChipClick = (chip) => {
    setSelectedChips((prevSelectedChips) =>
      prevSelectedChips.includes(chip)
        ? prevSelectedChips.filter((c) => c !== chip)
        : [...prevSelectedChips, chip]
    );
  };
  const handleDrugChipClick = (chip) => {
    setSelectedDrugChips((prevSelectedDrugChips) =>
      prevSelectedDrugChips.includes(chip)
        ? prevSelectedDrugChips.filter((c) => c !== chip)
        : [...prevSelectedDrugChips, chip]
    );
  };
  const handleSkillTypeChip = (chip) => {
    console.log(chip);
    setSelectedSkillTypeChip((prevSelectedSkillTypeChips) =>
      prevSelectedSkillTypeChips.includes(chip?._id)
        ? prevSelectedSkillTypeChips.filter((c) => c !== chip?._id)
        : [...prevSelectedSkillTypeChips, chip?._id]
    );
  };
  const propertyTypes = [
    "AB Property",
    "New Construction",
    "High Rise Multi Family",
    "Rehab or Renovations",
    "Lease Up",
    "Public Housing",
    "Tax Credit",
    "Large Community 500+ Units",
  ];

  // register for forms
  const {
    register,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm();
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue,
    control: control2,
    formState: { errors: errors1 },
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
    watch,
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm();
  const {
    register: register4,
    handleSubmit: handleSubmit4,
    formState: { errors: errors4 },
  } = useForm();

  const hoursFrom = watch("hoursFrom");
  const hoursTo = watch("hoursTo");
  const getCompanies = async (
    idParam = "",
    searchParam = "",
    dateFromParam = "",
    dateToParam = "",
    pageParam = 1,
    limitParam = 10
  ) => {
    try {
      const { data } = await CompanyServices.getCompany(
        idParam,
        searchParam,
        dateFromParam ? dateFromParam : "",
        dateToParam ? dateToParam : "",
        pageParam,
        limitParam
      );
      console.log(data.list);
      setManagmentCompanyData(data.list);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanies(id, search, dateFrom, dateTo, "1", "999");
    getCodesData();
  }, []);
  const skillTypes = [
    "Leasing Consultant",
    "Grounds/Housekeeping",
    "Lead Maintenance/Asst Maint",
    "Manager/Assistant",
    "Asst Maintanace/Make ready",
  ];

  // function for all steps
  const form1Data = (data) => {
    const obj = {
      property: property,
    };
    console.log(obj);
    setForm1(data);

    setActiveStep((prevStep) => prevStep + 1);
  };

  const form2Data = (data) => {
    const obj = {
      experience: data.experience,
      position: data.position,
      skills: {
        skill_type: selectedSkill,
        skillTypeData: selectedSkillTypeChip,
      },
    };
    console.log(obj);
    setForm2(obj);
    console.log(selectedSkillTypeChip);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const form3Data = (data) => {
    const obj = {
      area: data.area,
      jobType: data.jobType,
      propertyType: selectedChips,
      tempWork: {
        hoursFrom: data.hoursFrom,
        hoursTo: data.hoursTo,
        workOnSameDay: data.workOnSameDay,
        callAfterHour: data.callAfterHour,
        workWeekends: data.workWeekends,
        haveTransportation: data?.haveTransportation,
        willTravel: data?.willTravel,
        willWorkOnBraunfels: data.willWorkOnBraunfels,
        willWorkOnBorene: data.willWorkOnBorene,
      },

      directHire: {
        desiredSalary: data.desiredSalary,
        minSalary: data.minSalary,
        callAfterHour: data.callAfterHour1,
        workWeekends: data.workWeekends1,
        insurance: data?.insurance,
        liveOnSite: data?.liveOnSite,
        relocate: data.relocate,
      },
    };
    console.log(obj);
    setForm3(obj);
    setActiveStep((prevStep) => prevStep + 1);
  };
  const form4Data = (data) => {
    console.log(data);
    setForm4(data);
    setActiveStep((prevStep) => prevStep + 1);
  };
  const form5Data = async (data) => {
    console.log(selectedValues);
    const obj = {
      name: form1.jobName,
      property_id: property,
      company_id: form1.managmentCompany,
      // job_type:form1.jobType1,
      phone: form1.phoneNumber,
      cp_name: form1.contactPerson,
      cp_title: form1.contactPersonTitle,
      cp_phone: form1.contactPersonCellPhone,
      assigned_to: [],
      start_date: "",
      end_date: "",

      experience: form2.experience,
      position: form2.position,
      skill_type: form2.skills.skill_type,
      skills: form2.skills.skillTypeData.map((skill) => ({
        skill_card_id: skill,
      })),
      // area_town: form3.area,
      // job_type: form3.jobType,
      // property_types: form3.propertyType,

      temporary_work: {
        hours_from: form3.tempWork.hoursFrom,
        hours_to: form3.tempWork.hoursTo,
        same_day_assignment: form3.tempWork.workOnSameDay,
        after_hours: form3.tempWork.callAfterHour,
        work_weekends: form3.tempWork.workWeekends,
        salary: "",
      },
      direct_hire: {
        desired_salary: form3.directHire.desiredSalary,
        after_hours: form3.directHire.callAfterHour,
        work_weekends: form3.directHire.workWeekends,
        insurance_mandatory: form3.directHire.insurance,
      },
      transportation: form3.tempWork.haveTransportation,
      travel: form3.tempWork.willTravel,
      new_branfels: form3.tempWork.willWorkOnBraunfels,
      boerne: form3.tempWork.willWorkOnBorene,
      // minimum_salary: form3.directHire.minSalary,
      live_on_site: form3.directHire.liveOnSite,
      relocate: form3.directHire.relocate,
      codes: inputValues,
      documents: fileURL,
      language: language,
      driving_license: data.drivingLicense,
      // restrictions: selectedValues.map((item) => item._id),
      recreational_drugs: selectedDrugChips,
      additional_notes: data.notes,
    };
    console.log(obj);
    setIsSubmitting(true);
    try {
      const { response, message } = await JobServices.createJob(obj);
      console.log(response);
      SuccessToaster(message);
      navigate("/jobrequest");
    } catch (error) {
      ErrorHandler(error?.message);
      ErrorToaster(error?.message);
      console.error("Error uploading image: ", error?.message);
    } finally {
      setIsSubmitting(false);
    }
    // setActiveStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setSelectedSkillTypeChip([]);
    setOpen(false);
  };

  const handleSelect = (skill) => {
    setSelectedSkill(skill);
    setValue("skillType", skill, { shouldValidate: true });
    console.log(selectedSkill);
    getSkills(skill);
    handleClose();
  };
  const CustomStepperRoot = styled(Stepper)(({ theme }) => ({
    width: "98%",
    paddingLeft: "15px",
    backgroundColor: "transparent",
  }));

  const CustomStep = styled(Step)(({ theme }) => ({
    ".MuiStepLabel-root": {
      flexDirection: "row !important",
      alignItems: "center !important",
      borderTop: "3px solid #ff4081   !important",
      paddingTop: "12px !important",
      justifyContent: "center",
    },
    ".MuiStepLabel-iconContainer": {
      cursor: "pointer",
    },
    ".MuiStepLabel-label": {
      marginTop: "0 !important",
    },
    ".MuiStepLabel-labelContainer": {
      width: "150px !important",
    },
    ".MuiStepConnector-root": {
      display: "none",
    },
    "&.MuiStep-active .MuiStepLabel-root": {
      borderTopColor: "#ff4081 !important", // Pink color for active step
    },
    "& .Mui-disabled": {
      borderColor: "grey !important",
    },
    "& .Mui-completed , .Mui-active": {
      color: "#ff4081 !important",
    },
  }));

  const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
    "& .MuiStepLabel-alternativeLabel": {
      marginTop: 0,
    },
  }));

  const UploadBox = styled(Box)(({ theme }) => ({
    border: "2px dashed #FF00A6",
    marginTop: "20px",
    borderRadius: "8px",
    padding: theme.spacing(4),
    textAlign: "center",
    backgroundColor: "#F0F8F8",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#E8F0F0",
    },
  }));

  const UploadIcon = styled("div")({
    fontSize: "48px",
    color: "#FF00A6",
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const maxSize = 25 * 1024 * 1024; // 25 MB in bytes

    if (file.size > maxSize) {
      ErrorToaster("File size exceeds 25 MB. Please upload a smaller file.");

      e.target.value = null;
      return;
    }
    try {
      const formData = new FormData();
      formData.append("document", e.target.files[0]);

      const response = await FileServices.uploadImage(formData);
      console.log(response?.data?.path);
      setFileURL(response?.data?.path);
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;

    // Assuming selectedValues and setMultiInputValue are defined elsewhere
    const valueSet = new Set(selectedValues.map((item) => item));

    if (!valueSet.has(value)) {
      valueSet.add(value);
      // Assuming setMultiInputValue("") clears some input state
      setMultiInputValue("");
    }

    setSelectedValues(Array.from(valueSet)); // Convert Set back to Array of _id values

    console.log(Array.from(valueSet), "Selected Values");
  };

  const handleDelete = (valueToDelete) => () => {
    setSelectedValues((values) =>
      values.filter((value) => value !== valueToDelete)
    );
  };

  //api to get skills
  const getSkills = async (selectedSkill) => {
    console.log(selectedSkill);
    try {
      const { data } = await SkillServices.getSkill(selectedSkill);
      console.log(data);
      const groupedSkills = data.skills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      setSkillsData(groupedSkills);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    }
  };

  //api to get Properties
  const getProperties = async (
    searchParam = "",
    idParam = "",
    pageParam = 1,
    limitParam = 10,
    companyId = ""
  ) => {
    try {
      const { data } = await PropertyServices.getProperty(
        searchParam ? searchParam : "",
        idParam ? idParam : "",
        pageParam ? pageParam : "1",
        limitParam ? limitParam : "999",
        companyId ? companyId : ""
      );
      console.log(data.list);
      setPropertyData(data.list);
      setProperty(data.list[0]?._id);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    }
  };
  const getCodesData = async () => {
    try {
      const { data } = await SkillServices.getCode();
      console.log(data.Codes);
      setCodesData(data.Codes);
    } catch (error) {
      ErrorHandler(error);
      console.log(error);
    }
  };
  const handleChange = (shortCodeId, value) => {
    setInputValues((prevValues) => {
      const existingIndex = prevValues.findIndex(
        (item) => item.short_code_id === shortCodeId
      );

      if (existingIndex !== -1) {
        if (value === "") {
          // Remove the object if the value is empty
          return prevValues.filter(
            (item) => item.short_code_id !== shortCodeId
          );
        } else {
          // Update the existing object
          const updatedValues = [...prevValues];
          updatedValues[existingIndex].value = value;
          return updatedValues;
        }
      } else {
        if (value === "") {
          // If value is empty, do not add a new object
          return prevValues;
        } else {
          // Add a new object
          return [...prevValues, { short_code_id: shortCodeId, value }];
        }
      }
    });
    console.log(inputValues);
  };

  const handleStepClick = (index) => {
    if (index < activeStep && activeStep > 0) {
      setActiveStep(index);
    }
  };

  const phoneNumberValidation = (value, country) => {
    const usPhonePattern = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{5})$/;
    const mxPhonePattern = /^(\+52)?\d{12}$/;

    if (country === "us") {
      return (
        usPhonePattern.test(value) || "Please enter a valid US phone number"
      );
    } else if (country === "mx") {
      return (
        mxPhonePattern.test(value) ||
        "Please enter a valid Mexican phone number"
      );
    }
    return true;
  };
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
          Job Request /
        </Typography>
        <Typography
          sx={{ fontSize: "22px", color: Colors.primary, fontWeight: "600" }}
        >
          Add New
        </Typography>
      </Box>
      <Box sx={{ width: "100%", mt: 2 }}>
        <CustomStepperRoot activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <CustomStep key={index}>
              <CustomStepLabel onClick={() => handleStepClick(index)}>
                {label}
              </CustomStepLabel>
            </CustomStep>
          ))}
        </CustomStepperRoot>
        {activeStep === steps.length ? (
          <Typography variant="h6" align="center" sx={{ mt: 3, mb: 3 }}>
            All steps completed - you're finished
          </Typography>
        ) : (
          <>
            {activeStep === 0 && (
              <form
                style={{
                  marginTop: "14px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
                onSubmit={handleSubmit(form1Data)}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                  Job Details
                </Typography>
                <Box sx={{ mt: 1.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{
                          fontWeight: "bold",
                          color: Colors.black,
                          paddingLeft: "2px",
                        }}
                      >
                        Job Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        {...register("jobName", {
                          required: "job Name is required",
                          validate: (value) =>
                            value.trim() !== "" || "job Name is required",
                        })}
                        error={errors.jobName && true}
                        helperText={errors?.jobName?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Management Company
                      </InputLabel>
                      {console.log(managmentCompanyData)}
                      <Controller
                        name="managmentCompany"
                        control={control}
                        defaultValue={
                          managmentCompany ? managmentCompany._id : ""
                        }
                        rules={{ required: "Management Company is required" }}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            fullWidth
                            options={managmentCompanyData}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option._id === value._id
                            }
                            value={managmentCompany}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(errors.managmentCompany)}
                                helperText={errors?.managmentCompany?.message}
                              />
                            )}
                            onChange={(e, newValue) => {
                              setManagmentCompany(newValue);
                              console.log(newValue);
                              setCompanyId(newValue?._id);
                              getProperties(
                                search,
                                id,
                                "1",
                                "999",
                                newValue?._id
                              );

                              setValue(
                                "managmentCompany",
                                newValue ? newValue._id : ""
                              );
                              field.onChange(newValue ? newValue._id : "");
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Property
                      </InputLabel>
                      <Controller
                        name="property"
                        control={control}
                        defaultValue=""
                        rules={{
                          required:
                            property == undefined ? "Property  is required" : false,
                        }}
                        render={({ field }) => (
                          <Autocomplete
                            {...field}
                            fullWidth
                            options={propertyData}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option._id === value._id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(errors.property)}
                                helperText={errors?.property?.message}
                              />
                            )}
                            value={
                              propertyData.find(
                                (option) => option._id === property
                              ) || null
                            }
                            onChange={(e, newValue) => {
                              // setProperty(newValue ? newValue._id : "");
                              field.onChange(newValue ? newValue._id : "");
                            }}
                          />
                        )}
                      />
                    </Grid>

                    {/* <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Property
                      </InputLabel>
                      <Controller
                        name="property"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: {
                            value: true,
                            message: "Property is required",
                          },
                          validate: (value) => {
                            if (propertyData.length === 0) {
                              return "No properties available for the selected management company";
                            } else if (!value) {
                              return "Property is required";
                            }
                            return true;
                          },
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Autocomplete
                            {...field}
                            fullWidth
                            options={propertyData}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option._id === value._id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(error)}
                                helperText={error ? error.message : ""}
                              />
                            )}
                            value={
                              propertyData.find(
                                (option) => option._id === field.value
                              ) || null
                            }
                            onChange={(e, newValue) => {
                              field.onChange(newValue ? newValue._id : "");
                              setProperty(newValue ? newValue._id : ""); // Update the property state

                              if (newValue) {
                                clearErrors("property"); // Clear the error manually
                              }
                            }}
                          />
                        )}
                      />
                    </Grid> */}

                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Phone Number
                      </InputLabel>
                      <FormControl
                        sx={{
                          ".form-control": {
                            height: "56px !important",
                            background: "transparent !important",
                          },
                        }}
                        error={!!errors.phoneNumber}
                        fullWidth
                      >
                        <Controller
                          name="phoneNumber"
                          control={control}
                          rules={{
                            required: "Phone number is required",
                            validate: (value, formValues) => {
                              // Get the selected country code from the PhoneInput value
                              const selectedCountry =
                                value.slice(0, 2) === "52" ? "mx" : "us";
                              return phoneNumberValidation(
                                value,
                                selectedCountry
                              );
                            },
                          }}
                          render={({ field }) => (
                            <PhoneInput
                              country={"us"}
                              onlyCountries={["us", "mx"]}
                              countryCodeEditable={false}
                              value={field.value}
                              onChange={field.onChange}
                              inputStyle={{ width: "100%" }}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors.phoneNumber
                            ? errors?.phoneNumber?.message
                            : ""}
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Contact Person
                      </InputLabel>
                      <TextField
                        fullWidth
                        {...register("contactPerson", {
                          required: "Contact Person is required",
                          validate: (value) =>
                            value.trim() !== "" || "Contact Person is required",
                        })}
                        error={!!errors.contactPerson}
                        helperText={errors?.contactPerson?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Contact Person Title
                      </InputLabel>
                      <TextField
                        fullWidth
                        {...register("contactPersonTitle", {
                          required: "Contact Person Title is required",
                          validate: (value) =>
                            value.trim() !== "" ||
                            "Contact Person Title is required",
                        })}
                        error={!!errors.contactPersonTitle}
                        helperText={errors?.contactPersonTitle?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Contact Person Cell Phone
                      </InputLabel>
                      <FormControl
                        sx={{
                          ".form-control": {
                            height: "56px !important",
                            background: "transparent !important",
                          },
                        }}
                        error={!!errors.contactPersonCellPhone}
                        fullWidth
                      >
                        <Controller
                          name="contactPersonCellPhone"
                          control={control}
                          rules={{
                            required: "Contact Person Phone number is required",
                            validate: (value, formValues) => {
                              // Get the selected country code from the PhoneInput value
                              const selectedCountry =
                                value.slice(0, 2) === "52" ? "mx" : "us";
                              return phoneNumberValidation(
                                value,
                                selectedCountry
                              );
                            },
                          }}
                          render={({ field }) => (
                            <PhoneInput
                              country={"us"}
                              onlyCountries={["us", "mx"]}
                              value={field.value}
                              countryCodeEditable={false}
                              onChange={field.onChange}
                              inputStyle={{ width: "100%" }}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors.contactPersonCellPhone
                            ? errors?.contactPersonCellPhone?.message
                            : ""}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    // onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                </Box>
              </form>
            )}
            {activeStep === 1 && (
              <form
                style={{
                  marginTop: "14px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
                onSubmit={handleSubmit1(form2Data)}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                  Skills and Experience
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Experience
                      </InputLabel>
                      <TextField
                        fullWidth
                        select
                        {...register1("experience", {
                          required: "Experience is required",
                        })}
                        error={errors1.experience && true}
                        helperText={errors1?.experience?.message}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      >
                        <MenuItem value="0-1">0 - 1 Year</MenuItem>
                        <MenuItem value="1-3">1 - 3 Year</MenuItem>
                        <MenuItem value="3-5">3 - 5 Year</MenuItem>
                        <MenuItem value="5-7">5 - 7 Year</MenuItem>
                        <MenuItem value="7-10">7 - 10 Year</MenuItem>
                        <MenuItem value="10+">10+ Year</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Desired Position
                      </InputLabel>
                      <TextField
                        fullWidth
                        {...register1("position", {
                          required: "Desired Position is required",
                          validate: (value) =>
                            value.trim() !== "" ||
                            "Desired Position is required",
                        })}
                        error={errors1.position && true}
                        helperText={errors1?.position?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Skill Type
                      </InputLabel>
                      <Box sx={{ position: "relative" }}>
                        <Controller
                          name="skillType"
                          control={control2}
                          defaultValue=""
                          rules={{ required: "Skill Type is required" }} // Add required validation
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <Select
                                {...field}
                                value={selectedSkill}
                                onClick={handleToggle}
                                onClose={handleClose}
                                onChange={(e) => {
                                  setSelectedSkillTypeChip([]);
                                  field.onChange(e); // Update form state
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      opacity: "0 !important",
                                    },
                                  },
                                }}
                                open={open}
                                displayEmpty
                                renderValue={(selected) => {
                                  if (selected === "") {
                                    return "Select Skill Type";
                                  }
                                  return selected;
                                }}
                              ></Select>
                            </FormControl>
                          )}
                        />
                        {errors1.skillType && (
                          <Typography color="error">
                            {errors1.skillType.message}
                          </Typography>
                        )}
                        {open && (
                          <ClickAwayListener onClickAway={handleClose}>
                            <Paper
                              sx={{
                                position: "absolute",
                                width: "100%",
                                mt: 1,
                                p: 3,
                                zIndex: 111111,
                                borderRadius: "20px",
                                boxShadow: "0px 0px 100px 0px rgb(0,0,0,0.1)",
                              }}
                            >
                              <Typography
                                sx={{
                                  mb: 2,
                                  fontWeight: "bold",
                                  fontSize: "18px",
                                }}
                              >
                                Set Skill Type
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                }}
                              >
                                {skillTypes.map((skill, index) => (
                                  <Chip
                                    key={index}
                                    variant="outlined"
                                    onClick={() => handleSelect(skill)}
                                    label={skill}
                                  />
                                ))}
                              </Box>
                            </Paper>
                          </ClickAwayListener>
                        )}
                      </Box>
                    </Grid>
                    <Grid container spacing={2} sx={{ ml: 1 }}>
                      {selectedSkill &&
                        Object.keys(skillsData).map((category) => (
                          <Grid item xs={12} md={5} key={category}>
                            <Box sx={{ mt: 2 }}>
                              <Box sx={{ mb: 2 }}>
                                <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                                  {category}
                                </Typography>
                                {skillsData[category].map((chip, index) => (
                                  <Chip
                                    onClick={() => handleSkillTypeChip(chip)}
                                    key={chip._id}
                                    label={chip.skill}
                                    sx={{
                                      m: 0.5,
                                      border: selectedSkillTypeChip.includes(
                                        chip._id
                                      )
                                        ? `1px solid ${Colors.primary}`
                                        : "1px solid grey",
                                      background: "none",
                                      color: selectedSkillTypeChip.includes(
                                        chip._id
                                      )
                                        ? Colors.primary
                                        : "black",
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    mt: selectedSkill ? 10 : 29,
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      sx={{ px: 4 }}
                      variant="contained"
                      color="primary"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}

                  <Button type="submit" variant="contained" color="primary">
                    {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                </Box>
              </form>
            )}
            {activeStep === 2 && (
              <form
                style={{
                  marginTop: "14px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
                onSubmit={handleSubmit2(form3Data)}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                  Job Preference
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={10}>
                    {/* second */}
                    <Grid item xs={12} sm={12}>
                      <Grid container spacing={8}>
                        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                          <Grid container spacing={2} alignItems="flex-start">
                            <Grid item xs={12} sm={12}>
                              <InputLabel
                                sx={{ fontWeight: "bold", color: Colors.black }}
                              >
                                Specifications for Temporary Work
                              </InputLabel>
                              <InputLabel sx={{ mt: 1, color: Colors.black }}>
                                Hours Required{" "}
                              </InputLabel>
                            </Grid>

                            <Grid item xs={12} md={5.5}>
                              <TextField
                                fullWidth
                                type="time"
                                {...register2("hoursFrom", {
                                  required: "Hours From is required",
                                })}
                                error={!!errors2.hoursFrom}
                                helperText={
                                  errors2.hoursFrom
                                    ? errors2.hoursFrom.message
                                    : null
                                }
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={1}
                              sx={{
                                textAlign: "center",
                                paddingTop: "30px !important",
                              }}
                            >
                              to
                            </Grid>
                            <Grid item xs={12} md={5.5}>
                              <TextField
                                fullWidth
                                type="time"
                                {...register2("hoursTo", {
                                  required: "Hours To is required",
                                  validate: (value) => {
                                    
                                    if (hoursFrom && value <= hoursFrom) {
                                      return "Hours To cannot be same earlier than Hours From";
                                    }
                                    return true;
                                  },
                                })}
                                error={!!errors2.hoursTo}
                                helperText={
                                  errors2.hoursTo
                                    ? errors2.hoursTo.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  work on same day assignment required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="tempWork.sameDay"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={tempWork.workOnSameDay}
                                    onChange={handleTempState("workOnSameDay")}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("workOnSameDay")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("workOnSameDay")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  On Call Availibility required after
                                  hours/weekends?{" "}
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="callAfter"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={tempWork.callAfterHour}
                                    onChange={handleTempState("callAfterHour")}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("callAfterHour")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("callAfterHour")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Work on Weekends Required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="workWeekends"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={tempWork.workWeekends}
                                    onChange={handleTempState("workWeekends")}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("workWeekends")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("workWeekends")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Grid item xs={12} sm={12} sx={{ mt: 4.4 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Own Transport required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="transportation"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={tempWork.haveTransportation}
                                    onChange={handleTempState(
                                      "haveTransportation"
                                    )}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("haveTransportation")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("haveTransportation")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Travelling Required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="willTravel"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={tempWork.willTravel}
                                    onChange={handleTempState("willTravel")}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("willTravel")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("willTravel")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Working on Braunfels Required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="willWorkOnBraunfels"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={tempWork.willWorkOnBraunfels}
                                    onChange={handleTempState(
                                      "willWorkOnBraunfels"
                                    )}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("willWorkOnBraunfels")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("willWorkOnBraunfels")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Working on Boerne Required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="willWorkOnBorene"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={tempWork.willWorkOnBorene}
                                    onChange={handleTempState(
                                      "willWorkOnBorene"
                                    )}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("willWorkOnBorene")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("willWorkOnBorene")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* third */}
                    <Grid item xs={12} sm={12}>
                      <Grid container spacing={8}>
                        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={12}>
                              <InputLabel
                                sx={{ fontWeight: "bold", color: Colors.black }}
                              >
                                Specifications for Direct Hire
                              </InputLabel>
                              <InputLabel sx={{ mt: 1, color: Colors.black }}>
                                Salary Offered
                              </InputLabel>
                            </Grid>

                            <Grid item xs={12} md={8}>
                              <TextField
                                fullWidth
                                type="text"
                                placeholder="Enter Amount"
                                {...register2("desiredSalary", {
                                  required: "Desired Salary is required",
                                  pattern: {
                                    value: /^[0-9]*$/,
                                    message: "Salary Should Be in Numeric",
                                  },
                                })}
                                error={errors2.desiredSalary && true}
                                helperText={errors2?.desiredSalary?.message}
                                // value={formValues.tempWork.hoursFrom}
                                // onChange={handleTempState}
                              />
                            </Grid>
                          </Grid>

                          <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  On Call Availibility required after
                                  hours/weekends{" "}
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="callAfter"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={directHire.callAfterHour}
                                    onChange={handleDirecdHireState(
                                      "callAfterHour"
                                    )}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("callAfterHour1")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("callAfterHour1")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Work on Weekends Required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="workWeekends2"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={directHire.workWeekends}
                                    onChange={handleDirecdHireState(
                                      "workWeekends"
                                    )}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("workWeekends1")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("workWeekends1")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Insurance Benefits Provided?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="tempWork.sameDay"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={directHire.insurance}
                                    onChange={handleDirecdHireState(
                                      "insurance"
                                    )}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("insurance")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("insurance")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                          <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Required to Live on Site?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="onSite"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={directHire.liveOnSite}
                                    onChange={handleDirecdHireState(
                                      "liveOnSite"
                                    )}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("liveOnSite")}
                                      c
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("liveOnSite")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <InputLabel sx={{ color: Colors.black }}>
                                  Relocation Required?
                                </InputLabel>
                                <FormControl component="fieldset">
                                  <RadioGroup
                                    name="relocate"
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                    value={directHire.relocate}
                                    onChange={handleDirecdHireState("relocate")}
                                  >
                                    <FormControlLabel
                                      value="true"
                                      control={<Radio />}
                                      label="Yes"
                                      {...register2("relocate")}
                                    />
                                    <FormControlLabel
                                      value="false"
                                      control={<Radio />}
                                      label="No"
                                      {...register2("relocate")}
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    mt: 2,
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      sx={{ px: 4 }}
                      variant="contained"
                      color="primary"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}

                  <Button type="submit" variant="contained" color="primary">
                    {activeStep === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                </Box>
              </form>
            )}

            {activeStep === 3 && (
              <form
                style={{
                  marginTop: "14px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
                onSubmit={handleSubmit4(form5Data)}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                  Additional Details
                </Typography>
                <Box sx={{ mt: 3 }}></Box>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={5}>
                    <InputLabel
                      sx={{ fontWeight: "bold", color: Colors.black }}
                    >
                      Languages
                    </InputLabel>
                    <TextField
                      fullWidth
                      // sx={{ width: "300px" }}
                      select
                      placeholder="Select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <MenuItem value="Billingual">Billingual</MenuItem>
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Spanish">Spanish</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <InputLabel
                      sx={{ fontWeight: "bold", color: Colors.black }}
                    >
                      Driving License
                    </InputLabel>
                    <FormControl component="fieldset">
                      <RadioGroup
                        name="drivingLicense"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                        value={drivingLicense}
                        onChange={(e) => setDrivingLicense(e.target.value)}
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Yes"
                          {...register4("drivingLicense")}
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="No"
                          {...register4("drivingLicense")}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <InputLabel
                      sx={{ fontWeight: "bold", color: Colors.black }}
                    >
                      Recreational Drugs
                    </InputLabel>
                    <Chip
                      //   key={value}
                      label={"Smoking"}
                      onClick={() => handleDrugChipClick("Smoking")}
                      sx={{
                        margin: 0.5,
                        border: selectedDrugChips.includes("Smoking")
                          ? `1px solid ${Colors.primary}`
                          : "1px solid grey",
                        background: "none",
                        color: selectedDrugChips.includes("Smoking")
                          ? Colors.primary
                          : "black",
                      }}
                    />
                    <Chip
                      //   key={value}
                      label={"Alcohol"}
                      onClick={() => handleDrugChipClick("Alcohol")}
                      sx={{
                        margin: 0.5,
                        border: selectedDrugChips.includes("Alcohol")
                          ? `1px solid ${Colors.primary}`
                          : "1px solid grey",
                        background: "none",
                        color: selectedDrugChips.includes("Alcohol")
                          ? Colors.primary
                          : "black",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <InputLabel
                      sx={{ fontWeight: "bold", color: Colors.black }}
                    >
                      Additional Notes
                    </InputLabel>
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      // rows={4}
                      margin="normal"
                      {...register4("notes")}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", color: "black" }}>
                      Background Check
                    </InputLabel>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {codesData?.map((item) => (
                        <FormControl
                          key={item._id}
                          variant="standard"
                          sx={{ mb: 2, pl: 2, width: "200px" }}
                        >
                          <Input
                            sx={{ ml: 2, width: "200px" }}
                            value={
                              inputValues.find(
                                (codeItem) =>
                                  codeItem.short_code_id === item._id
                              )?.value || ""
                            }
                            onChange={(e) =>
                              handleChange(item._id, e.target.value)
                            }
                            id={`input-with-icon-adornment-${item._id}`}
                            startAdornment={
                              <InputAdornment position="start">
                                {item.code}
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    mt: 4,
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      sx={{ px: 4 }}
                      variant="contained"
                      color="primary"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Continue"}
                  </Button>
                </Box>
              </form>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default EmployeeForm;
