import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Link,
  Tooltip,
  Input,
  InputAdornment,
  Autocomplete,
  CircularProgress,
  FormHelperText,
  backdropClasses,
  Modal,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { PhotoCamera } from "@mui/icons-material";
import Colors from "../../../assets/styles";
import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import { Images, Svgs } from "../../../assets/images";
import { ErrorHandler } from "../../../utils/ErrorHandler";
import SkillServices from "../../../api/SkillServices/skill.index";
import FileServices from "../../../api/FileServices/file.index";
import {
  ErrorToaster,
  SuccessToaster,
} from "../../../components/Toaster/index";
import EmployeeServices from "../../../api/EmployeeServices/employee.index";
import PropertyServices from "../../../api/PropertyServices/property.index";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Person, Work, Favorite, Description, Info } from "@mui/icons-material";
import AuthServices from "../../../api/AuthServices/auth.index";
import SimpleDialog from "../../../components/Dialog";
import { CheckCircle } from "@mui/icons-material";
const stepIcons = {
  1: <Person />,
  2: <Work />,
  3: <Favorite />,
  4: <Description />,
  5: <Info />,
};

const steps = [
  "Personal info",
  "Skill and Experience",
  "Job Preference",
  "Personal Documents",
  "Additional Details",
];
const restrictedPlaces = ["Dubai Iconic Tower", "Aewari Tower", "Huwai Town"];

const EmployeeRegister = () => {
  const containerRef = useRef(null);
  const [experience, setExperience] = useState("0-1");
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [area, setArea] = useState("");
  const [jobType, setJobType] = useState("");
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
  const [allCities, setAllCities] = useState([]);
  const [selectedSkillTypeChip, setSelectedSkillTypeChip] = useState([]);
  const [skillsData, setSkillsData] = useState({});
  const [fileURL, setFileURL] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [language, setLanguage] = useState("English");
  const [hovered, setHovered] = useState(false);
  const [drug, setDrug] = useState(false);
  const [propertyData, setPropertyData] = useState([]);
  const [codesData, setCodesData] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [age, setAge] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileError, setFileError] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [checkValidate, setCheckValidate] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [checkPhoneValidate, setCheckPhoneValidate] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const navigate = useNavigate();
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

  const fileInputRef = useRef(null);
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  console.log(citiesData.data);
  const handleFileChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append("document", e.target.files[0]);

      const response = await FileServices.uploadImage(formData);
      console.log(imageURL);
      setImageURL(response?.data?.path);
    } catch (error) {
      ErrorHandler(error);
      ErrorToaster(error);
      console.log(error?.message);
    }
  };
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

  const itemPerPage = 30;

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
    setValue: setValue1,
    formState: { errors },
    trigger,
    control: control1,
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
    watch,
    setValue: setValue2,
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
    control,
  } = useForm();
  const {
    register: register4,
    handleSubmit: handleSubmit4,
    formState: { errors: errors4 },
  } = useForm();
  const hoursFrom = watch("hoursFrom");
  const hoursTo = watch("hoursTo");

  const skillTypes = [
    "Leasing Consultant",
    "Grounds/Housekeeping",
    "Lead Maintenance/Asst Maint",
    "Manager/Assistant",
    "Asst Maintanace/Make ready",
  ];

  // function for all steps
  const form1Data = (data) => {
    console.log(data);
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
    if (searchTerm == "") {
      setFormSubmitted(true);
    } else {
      setForm3(obj);
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  const form4Data = (data) => {
    if (fileURL.length === 0) {
      setFileError(true);
    } else {
      setFileError(false);
      // handleSubmit3(data);
      setForm4(data);
      setActiveStep((prevStep) => prevStep + 1);
    }
    console.log(fileURL);
  };
  const form5Data = async (data) => {
    console.log(selectedValues);
    const obj = {
      first_name: form1.firstName,
      last_name: form1.lastName,
      picture: imageURL,
      phone: form1.phoneNumber,
      email: form1.email,
      age: age,
      emergency_num: form1.emergencyNumber,
      experience: form2.experience,
      desired_position: form2.position,
      skill_type: form2.skills.skill_type,
      skills: form2.skills.skillTypeData.map((skill) => ({
        skill_card_id: skill,
      })),
      area_town: searchTerm,
      job_type: form3.jobType,
      // property_types: ["AB"],
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
      // minimum_salary:"11",
      live_on_site: form3.directHire.liveOnSite,
      relocate: form3.directHire.relocate,

      documents: fileURL,
      language: language,
      driving_license: data.drivingLicense,
      restrictions: selectedValues.map((item) => item._id),
      recreational_drugs: selectedDrugChips,
      additional_notes: data.notes,

      codes: inputValues,
    };
    console.log(obj);
    setIsSubmitting(true);
    try {
      const { response, message } = await AuthServices.register(obj);
      console.log(response);
      setMessageModal(true);
      setSuccessMessage(message);
      // SuccessToaster(message);
      // navigate("/login");
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
    width: "40px",
    paddingLeft: "15px",
    backgroundColor: "transparent",
    flexDirection: "column",
    ".MuiStepConnector-root .MuiStepConnector-line": {
      borderLeftWidth: "0px !important",
    },
  }));

  const CustomStep = styled(Step)(({ theme }) => ({
    ".MuiStepLabel-root": {
      flexDirection: "column !important", // Align icon vertically
      alignItems: "center !important", // Center align the icon
      borderLeft: "3px solid #ff4081 !important", // Vertical line indicator
      padding: "4px !important", // Adjust padding for vertical layout
      justifyContent: "center",
      width: "100% !important",
      height: "87px",
    },

    ".MuiStepLabel-iconContainer": {
      cursor: "pointer",
      "& .MuiSvgIcon-root": {
        fontSize: "2rem", // Adjust the icon size if needed
      },
    },
    ".MuiStepIcon-root": {
      display: "none", // Hide default step number
    },
    ".MuiStepLabel-label": {
      display: "none", // Hide default label
    },
    "&.MuiStep-active .MuiStepLabel-root": {
      borderLeftColor: "#ff4081 !important", // Pink color for active step
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
    const files = e.target.files;
    const maxSize = 25 * 1024 * 1024; // 25 MB in bytes
    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > maxSize) {
        // Display an error message if file size exceeds the limit
        ErrorToaster(
          `File ${file.name} exceeds 25 MB. Please upload a smaller file.`
        );

        // Skip this file and continue with the next one
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("document", file);

        // Assuming FileServices.uploadImage is an async function that uploads the file
        const response = await FileServices.uploadImage(formData);
        console.log(response?.data?.path);

        uploadedFiles.push(response?.data?.path);
      } catch (error) {
        console.error(`Error uploading file ${file.name}: `, error);
      }
    }

    // Update state with all uploaded file URLs and clear error if files were uploaded
    if (uploadedFiles.length > 0) {
      setFileError(false);
      setFileURL([...fileURL, ...uploadedFiles]);
    }
  };
  // const containerRef = useRef(null);
  const handleDeleteFile = (index) => {
    const updatedFiles = [...fileURL];
    updatedFiles.splice(index, 1); // Remove the file at the specified index
    setFileURL(updatedFiles); // Update state to reflect deletion
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
    companyId
  ) => {
    try {
      const { data } = await PropertyServices.getProperty(
        searchParam ? searchParam : "",
        idParam ? idParam : "",
        pageParam ? pageParam : "1",
        limitParam ? limitParam : "999",
        companyId
      );
      console.log(data.list);
      setPropertyData(data.list);
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
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === "") {
      setCitiesData(allCities.slice(0, itemPerPage));
    } else {
      const filteredFonts = allCities.filter((font) =>
        font.toLowerCase().includes(term.toLowerCase())
      );
      setCitiesData(filteredFonts);
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
    console.log(index);
    if (index < activeStep && activeStep != 0) {
      setActiveStep(index);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const obj = { country: "United States" };
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        obj
      );
      setCitiesData(response?.data?.data?.slice(0, itemPerPage));
      setAllCities(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreFonts = useCallback(() => {
    console.log("sdaasdasd");
    const itemsPerPage = 30;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newCities = allCities.slice(startIndex, endIndex);
    const newFonts = newCities;
    setCitiesData((prevFonts) => [...prevFonts, ...newFonts]);
    setLoading(false);
  }, [page, loading, citiesData]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
      setPage((prevPage) => prevPage + 1);
      console.log(page);
    }
  };
  useEffect(() => {
    loadMoreFonts();
  }, [page]);

  useEffect(() => {
    getProperties("", "", "1", "999", "");
    getCodesData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailValue.trim() !== "") {
        checkEmailDuplication(emailValue);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [emailValue]);

  const checkEmailDuplication = async (email) => {
    setLoading(true);
    const obj = {
      email: email,
    };
    try {
      const data = await AuthServices.checkEmail(obj);
      console.log(data);
      setCheckValidate(data.status);
    } catch (error) {
      setCheckValidate(false);
      console.log(error);
      ErrorToaster(error);
    }
    setLoading(false);
  };

  const checkPhoneDuplication = async (phone) => {
    setLoading(true);
    const obj = {
      phone: phone,
    };
    try {
      const data = await AuthServices.checkPhone(obj);
      setCheckPhoneValidate(data.status);
      console.log(data);
    } catch (error) {
      setCheckPhoneValidate(false);

      console.log(error);
      ErrorToaster(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneValue.trim() !== "") {
        checkPhoneDuplication(phoneValue);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [phoneValue]);

  const phoneNumberValidation = (value, country) => {
    const usPhonePattern = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{5})$/;
    const mxPhonePattern = /^(\+52)?\d{12}$/;

    if (country === "us") {
      return usPhonePattern.test(value) || "Please enter a valid US phone number";
    } else if (country === "mx") {
      return mxPhonePattern.test(value) || "Please enter a valid Mexican phone number";
    }
    return true;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          alignItems: "center",
          p: 2,
          py: 1,
          backgroundColor: Colors.dashboardBgColor,
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        }}
      >
        <img width="170px" src={Images.bgLogin} />

        <Box>
          <Typography
            onClick={() => navigate("/login")}
            sx={{
              cursor: "pointer",
              padding: "4px 15px",
              borderRadius: "10px ",
              fontFamily: "Poppins",
              background: Colors.primary,
              color: Colors.white,
            }}
          >
            login
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: "center",
          mt: 2,
          color: Colors.primary,
          fontWeight: "600",
          fontSize: "25px",
        }}
      >
       Employee Signup
      </Box>
      <Box
        sx={{
          width: "100%",
          mt: 2,
          backgroundColor: Colors.backgroundColor,
          display: "flex",
          gap: "20px",
        }}
      >
        {/* <CustomStepperRoot activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <CustomStep key={index}>
              <CustomStepLabel
                //  sx={{
                //   ".MuiStepLabel-labelContainer":{
                //     display:{sm:"none !important",md:"block !important"}
                //   }
                // }}
                onClick={() => handleStepClick(index)}
              >
                {label}
              </CustomStepLabel>
            </CustomStep>
          ))}
        </CustomStepperRoot> */}

        {/* <CustomStepperRoot  epperRoot activeStep={activeStep} orientation="vertical">
    {steps.map((label, index) => (
      <CustomStep key={index}   onClick={() => handleStepClick(index)}>
        <CustomStepLabel
          icon={stepIcons[index + 1]} // Use icon instead of number
          onClick={() => handleStepClick(index)}
        >
        </CustomStepLabel>
      </CustomStep>
    ))}
  </CustomStepperRoot> */}

        {activeStep === steps.length ? (
          <Typography variant="h6" align="center" sx={{ mt: 3, mb: 3 }}>
            All steps completed - you're finished
          </Typography>
        ) : (
          <>
            {activeStep === 0 && (
              <form
                style={{
                  marginTop: "8px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  //   backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  width: "100%",
                }}
                onSubmit={handleSubmit(form1Data)}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                  Personal Details
                </Typography>
                <Box sx={{ mt: 1.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="130px"
                      >
                        <Typography sx={{ fontWeight: "bold" }}>
                          Upload Photo
                        </Typography>
                        <Box
                          sx={{
                            position: "relative",
                            width: 90,
                            height: 90,
                            margin: "0 auto",
                            mt: 2,
                          }}
                          onMouseEnter={() => setHovered(true)}
                          onMouseLeave={() => setHovered(false)}
                        >
                          <Box
                            component="img"
                            // src={userDetail[0]?.image ?"https://crm.mangotech-api.com" +userDetail[0]?.image :Images.defaultImage}
                            src={baseUrl + imageURL}
                            sx={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              cursor: "pointer",
                              objectFit: "cover",
                              border: "1px solid grey",
                              background: !imageURL ? Colors.primary : "",
                            }}
                            onClick={(e) => {
                              handleImageClick(e);
                            }}
                          />

                          {(hovered || !imageURL) && (
                            <IconButton
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                background: imageURL ? "" : Colors.primary,
                                padding: "32px 35px",
                                transform: "translate(-50%, -50%)",
                                color: "white",
                                borderRadius: "50%",
                                display: "block",
                                "&:hover": {
                                  background: imageURL ? "" : Colors.primary,
                                },
                              }}
                              onClick={(e) => {
                                handleImageClick(e);
                              }}
                            >
                              <PhotoCamera />
                            </IconButton>
                          )}

                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        First Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        {...register("firstName", {
                          required: "First Name is required",
                          validate: (value) =>
                            value.trim() !== "" || "First Name is required",
                        })}
                        error={errors.firstName && true}
                        helperText={errors?.firstName?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Last Name
                      </InputLabel>
                      <TextField
                        fullWidth
                        {...register("lastName", {
                          required: "Last Name is required",
                          validate: (value) =>
                            value.trim() !== "" || "Last Name is required",
                        })}
                        error={!!errors.lastName}
                        helperText={errors?.lastName?.message}
                      />
                    </Grid>
                    {/* <Grid item xs={12} md={5}>
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
                          control={control1}
                          rules={{
                            required: "Phone number is required",
                            validate: (value) =>
                              value.trim() !== "" || "Phone Number is required",
                          }}
                          render={({ field }) => (
                            <PhoneInput
                              country={"us"}
                              onlyCountries={["us", "mx"]}
                              value={field.value}
                              onChange={field.onChange}
                              inputStyle={{ width: "100%" }}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors.phoneNumber ? errors.phoneNumber.message : ""}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}
                    <Grid item xs={12} md={5}>
                      <InputLabel sx={{ fontWeight: "bold", color: "black" }}>
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
                          control={control1}
                          rules={{
                            required: "Phone number is required",
                            validate: (value, formValues) => {
                              // Get the selected country code from the PhoneInput value
                              const selectedCountry = value.slice(0, 2) === "52" ? "mx" : "us";
                              return phoneNumberValidation(value, selectedCountry);
                            },
                          }}
                          render={({ field }) => (
                            <PhoneInput
                              country={"us"}
                              onlyCountries={["us", "mx"]}
                              countryCodeEditable={false}

                              value={phoneValue} // Use local state for phoneValue
                              onChange={(value) => {
                                setPhoneValue(value); // Update state when phone input changes
                                field.onChange(value); // Update form control value
                              }}
                              inputStyle={{ width: "100%" }}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors?.phoneNumber?.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Email
                      </InputLabel>
                      <TextField
                        fullWidth
                        {...register("email", {
                          required: "Email is required",
                          validate: (value) =>
                            value.trim() !== "" || "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        error={!!errors.email}
                        helperText={errors?.email?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <InputLabel
                        sx={{ fontWeight: "bold", color: Colors.black }}
                      >
                        Emergency Number
                      </InputLabel>
                      <FormControl
                        sx={{
                          ".form-control": {
                            height: "56px !important",
                            background: "transparent !important",
                          },
                        }}
                        error={!!errors.emergencyNumber}
                        fullWidth
                      >
                        <Controller
                          name="emergencyNumber"
                          control={control1}
                          rules={{
                            required: "Emergency Phone number is required",
                            validate: (value, formValues) => {
                              // Get the selected country code from the PhoneInput value
                              const selectedCountry = value.slice(0, 2) === "52" ? "mx" : "us";
                              return phoneNumberValidation(value, selectedCountry);
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
                          {errors.emergencyNumber
                            ? errors.emergencyNumber.message
                            : ""}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={5}>
  <InputLabel
    sx={{ fontWeight: "bold", color: Colors.black }}
  >
    Age
  </InputLabel>
  <TextField
    fullWidth
    type="text"
    {...register("age", {
      required: "Age is required",
      validate: (value) => {
        // Check if value contains only numbers
        if (!/^\d+$/.test(value)) {
          return "Age must contain only numbers";
        }

        const ageValue = parseInt(value, 10);
        if (ageValue < 16) {
          return "Age must be at least 16";
        }
        if (ageValue > 70) {
          return "Age must be less than or equal to 70";
        }
        return true;
      },
    })}
    onChange={(e) => {
      setValue1("age", e.target.value);
      setAge(e.target.value);
      trigger("age"); // To re-validate the field after change
    }}
    error={Boolean(errors.age)}
    helperText={errors?.age?.message}
    value={age}
  />
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
                    disabled={
                      checkValidate == false || checkPhoneValidate == false
                    }
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
                  //   backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  width: "100%",
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
              <Box
                component={"form"}
                sx={{
                  marginTop: "14px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  //   backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  width: { md: "100%", sm: "100%", xs: "81%" },
                }}
                onSubmit={handleSubmit2(form3Data)}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                  Job Preference
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={10}>
                    {/* first  */}
                    <Grid item xs={12} md={12}>
                      <Grid container spacing={8}>
                        <Grid item xs={12} sm={12} md={3}>
                          <InputLabel
                            sx={{ fontWeight: "bold", color: "black" }}
                          >
                            Area Town Preferred
                          </InputLabel>
                          <div>
                            <div>
                              <div className="dropdown-container">
                                <input
                                  type="text"
                                  id="dropdown-font"
                                  className="dropdown-toggle"
                                  placeholder="Select Area"
                                  style={{ fontFamily: searchTerm }}
                                  value={searchTerm}
                                  onClick={toggleDropdown}
                                  onChange={handleSearch}
                                />
                                {formSubmitted && !searchTerm && (
                                  <Box
                                    sx={{ fontSize: "12px", color: "#d32f2f" }}
                                  >
                                    Area Town is required.
                                  </Box>
                                )}
                                {isDropdownOpen && (
                                  <div className="dropdown-content">
                                    <div
                                      ref={containerRef}
                                      onScroll={handleScroll}
                                      className="dropdown-list"
                                    >
                                      {citiesData.map((font) => {
                                        return (
                                          <div
                                            key={font.family}
                                            style={{
                                              fontFamily: font.family,
                                              cursor: "pointer",
                                              padding: "10px",
                                            }}
                                            onClick={(e) => {
                                              setSearchTerm(font);
                                              setIsDropdownOpen(false);
                                            }}
                                          >
                                            {font}
                                          </div>
                                        );
                                      })}
                                      {loading && (
                                        <div>Loading more Areas...</div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3}>
                          <InputLabel
                            sx={{ fontWeight: "bold", color: Colors.black }}
                          >
                            Job Type Preference
                          </InputLabel>
                          <TextField
                            fullWidth
                            select
                            {...register2("jobType", {
                              required:
                                jobType == "" ? "Job Type is required" : false,
                              onChange: (e) => {
                                setValue2("jobType", e.target.value);
                                setJobType(e.target.value);
                              },
                            })}
                            error={errors2.jobType && true}
                            helperText={errors2?.jobType?.message}
                            value={jobType}
                            // onChange={(e) => setJobType(e.target.value)}
                          >
                            <MenuItem value="temporary">Temporary</MenuItem>
                            <MenuItem value="permanent">Permanent</MenuItem>
                          </TextField>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={6}>
                          <InputLabel
                            sx={{ fontWeight: "bold", color: Colors.black }}
                          >
                            Property Type
                          </InputLabel>
                          {propertyTypes.map((type) => (
                            <Chip
                              key={type}
                              label={type}
                              onClick={() => handleChipClick(type)}
                              sx={{
                                m: 1,
                                ml: 0,
                                border: selectedChips.includes(type)
                                  ? `1px solid ${Colors.primary}`
                                  : "1px solid grey",
                                background: "none",
                                color: selectedChips.includes(type)
                                  ? Colors.primary
                                  : "black",
                              }}
                              {...register2("propertyType")}
                            />
                          ))}
                        </Grid> */}
                      </Grid>
                    </Grid>

                    {/* second */}
                    <Grid item xs={12} sm={12}>
                      <Grid container spacing={8}>
                        <Grid item xs={12} md={6} sx={{ mt: 1 }}>
                          {/* <Grid container spacing={2} alignItems="center">
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
                              sx={{ textAlign: "center" }}
                            >
                              to
                            </Grid>
                            <Grid item xs={12} md={5.5}>
                              <TextField
                                fullWidth
                                type="time"
                                {...register2("hoursTo", {
                                  required: "Hours To is required",
                                })}
                                error={!!errors2.hoursTo}
                                helperText={
                                  errors2.hoursTo
                                    ? errors2.hoursTo.message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid> */}
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
                                  hours/weekends?
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
                          {/* <Grid container spacing={2} alignItems="center"> */}
                          {/* <Grid item xs={12} sm={12} sx={{ mt: 3 }}>
                              <InputLabel sx={{ mt: 1, color: Colors.black }}>
                                Minimum Salary
                              </InputLabel>
                            </Grid> */}

                          {/* <Grid item xs={12} md={8}>
                              <TextField
                                fullWidth
                                type="text"
                                placeholder="Enter Amount"
                                {...register2("minSalary", {
                                  required: "Minimum Salary is required",
                                })}
                                error={errors2.minSalary && true}
                                helperText={errors2?.minSalary?.message}

                                // value={formValues.tempWork.hoursFrom}
                                // onChange={handleTempState}
                              />
                            </Grid> */}
                          {/* </Grid> */}

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
              </Box>
            )}

            {activeStep === 3 && (
              <form
                style={{
                  marginTop: "14px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  //   backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  width: "100%",
                }}
                onSubmit={handleSubmit3(form4Data)}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                  Personal Documents
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
                    Upload Documents
                  </InputLabel>
                </Box>
                <Grid container>
                  <Grid item xs={12} md={5}>
                    <UploadBox>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        multiple
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.png,.jpeg,.jpg"
                        onChange={(e) => handleFileUpload(e)}
                      />
                      <label htmlFor="file-upload">
                        <UploadIcon
                          dangerouslySetInnerHTML={{ __html: Svgs["file"] }}
                        ></UploadIcon>
                        <Typography variant="h6" color="#FF00A6">
                          Click to Upload
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          (Max. File size: 25 MB)
                        </Typography>
                      </label>
                    </UploadBox>
                    {fileError && (
                      <Typography color="error" variant="body2">
                        Please upload a document.
                      </Typography>
                    )}
                  </Grid>
                  <Grid item md={12} sx={{ mt: 1 }}>
                    <>
                      {fileURL.length > 0 && (
                        <div>
                          <Grid container spacing={3}>
                            {fileURL.map((imagePath, i) => {
                              if (imagePath.toLowerCase().includes(".pdf")) {
                                return (
                                  <Grid item xs={12} sm={6} md={2} key={i}>
                                    <Box
                                      sx={{
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <img
                                        src={Images.pdfLogo}
                                        alt="prescriptionImg"
                                        style={{
                                          width: "100px",
                                          height: "150px",
                                          objectFit: "contain",
                                        }}
                                      />
                                      <Box
                                        sx={
                                          {
                                            // width: "200px",
                                          }
                                        }
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            // overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            wordBreak: "break-word",
                                            hyphens: "auto",
                                            maxWidth: "100%", // Ensure it doesn't overflow the container
                                          }}
                                        >
                                          {imagePath
                                            .split("_")
                                            .slice(1)
                                            .join("_")}
                                        </Typography>
                                      </Box>
                                      <Tooltip title="download">
                                        <Link
                                          sx={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
                                            cursor: "pointer",
                                            bgcolor: Colors.white,
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40,
                                            top: 10,
                                            "&:hover": {
                                              bgcolor: Colors.cloud,
                                            },
                                          }}
                                          onClick={() => {
                                            const url = baseUrl + imagePath;
                                            const link =
                                              document.createElement("a");
                                            link.href = url;
                                            link.target = "_blank"; // Open the link in a new tab
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                          }}
                                        >
                                          <SystemUpdateAltIcon
                                            sx={{
                                              fontSize: "24px",
                                              color: Colors.primary,
                                            }}
                                          />
                                        </Link>
                                      </Tooltip>
                                      <Tooltip title="delete">
                                        <Link
                                          sx={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
                                            cursor: "pointer",
                                            bgcolor: "#ffffffc9",
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40,
                                            left: 60,

                                            top: 10,
                                            "&:hover": {
                                              bgcolor: Colors.cloud,
                                            },
                                          }}
                                          onClick={() => handleDeleteFile(i)}
                                        >
                                          <DeleteIcon
                                            sx={{
                                              fontSize: "24px",
                                              color: Colors.primary,
                                            }}
                                          />
                                        </Link>
                                      </Tooltip>
                                    </Box>
                                  </Grid>
                                );
                              } else if (
                                imagePath.toLowerCase().includes(".docx")
                              ) {
                                return (
                                  <Grid item xs={12} sm={6} md={2} key={i}>
                                    <Box
                                      sx={{
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <img
                                        src={Images.wordIcon}
                                        alt="prescriptionImg"
                                        style={{
                                          width: "100px",
                                          height: "150px",
                                          objectFit: "contain",
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          width: "200px", // Same width as the image
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            // overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            wordBreak: "break-word",
                                            hyphens: "auto",
                                            maxWidth: "100%", // Ensure it doesn't overflow the container
                                          }}
                                        >
                                          {imagePath
                                            .split("_")
                                            .slice(1)
                                            .join("_")}
                                        </Typography>
                                      </Box>
                                      <Tooltip title="download">
                                        <Link
                                          sx={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
                                            cursor: "pointer",
                                            bgcolor: "#ffffffc9",
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40,
                                            top: 10,
                                            "&:hover": {
                                              bgcolor: Colors.cloud,
                                            },
                                          }}
                                          onClick={() => {
                                            const url = baseUrl + imagePath;
                                            const link =
                                              document.createElement("a");
                                            link.href = url;
                                            link.target = "_blank"; // Open the link in a new tab
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                          }}
                                        >
                                          <SystemUpdateAltIcon
                                            sx={{
                                              fontSize: "24px",
                                              color: Colors.primary,
                                            }}
                                          />
                                        </Link>
                                      </Tooltip>
                                      <Tooltip title="delete">
                                        <Link
                                          sx={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
                                            cursor: "pointer",
                                            bgcolor: "#ffffffc9",
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40,
                                            left: 60,
                                            top: 10,
                                            "&:hover": {
                                              bgcolor: Colors.cloud,
                                            },
                                          }}
                                          onClick={() => handleDeleteFile(i)}
                                        >
                                          <DeleteIcon
                                            sx={{
                                              fontSize: "24px",
                                              color: Colors.primary,
                                            }}
                                          />
                                        </Link>
                                      </Tooltip>
                                    </Box>
                                  </Grid>
                                );
                              } else if (
                                imagePath.toLowerCase().includes(".png") ||
                                imagePath.toLowerCase().includes(".jpg") ||
                                imagePath.toLowerCase().includes(".jpeg")
                              ) {
                                return (
                                  <Grid item xs={12} sm={6} md={2} key={i}>
                                    <Box
                                      sx={{
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <img
                                        src={Images.picIcon}
                                        alt="prescriptionImg"
                                        style={{
                                          width: "100px",
                                          height: "150px",
                                          objectFit: "contain",
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          width: "200px", // Same width as the image
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            // overflowWrap: "break-word",
                                            wordWrap: "break-word",
                                            wordBreak: "break-word",
                                            hyphens: "auto",
                                            maxWidth: "100%", // Ensure it doesn't overflow the container
                                          }}
                                        >
                                          {imagePath
                                            .split("_")
                                            .slice(1)
                                            .join("_")}
                                        </Typography>
                                      </Box>
                                      <Tooltip title="download">
                                        <Link
                                          sx={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
                                            cursor: "pointer",
                                            bgcolor: "#ffffffc9",
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40,
                                            top: 10,
                                            "&:hover": {
                                              bgcolor: Colors.cloud,
                                            },
                                          }}
                                          onClick={() => {
                                            const url = baseUrl + imagePath;
                                            const link =
                                              document.createElement("a");
                                            link.href = url;
                                            link.target = "_blank"; // Open the link in a new tab
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                          }}
                                        >
                                          <SystemUpdateAltIcon
                                            sx={{
                                              fontSize: "24px",
                                              color: Colors.primary,
                                            }}
                                          />
                                        </Link>
                                      </Tooltip>
                                      <Tooltip title="delete">
                                        <Link
                                          sx={{
                                            boxShadow:
                                              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;",
                                            cursor: "pointer",
                                            bgcolor: "#ffffffc9",
                                            position: "absolute",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 40,
                                            height: 40,
                                            borderRadius: 40,
                                            left: 60,
                                            top: 10,
                                            "&:hover": {
                                              bgcolor: Colors.cloud,
                                            },
                                          }}
                                          onClick={() => handleDeleteFile(i)}
                                        >
                                          <DeleteIcon
                                            sx={{
                                              fontSize: "24px",
                                              color: Colors.primary,
                                            }}
                                          />
                                        </Link>
                                      </Tooltip>
                                    </Box>
                                  </Grid>
                                );
                              }
                            })}
                          </Grid>
                          {/* Display additional information or actions related to the uploaded files */}
                        </div>
                      )}
                    </>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    mt: 9,
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
            {activeStep === 4 && (
              <form
                style={{
                  marginTop: "14px",
                  marginLeft: "16px",
                  marginRight: "16px",
                  padding: "20px",
                  //   backgroundColor: Colors.backgroundColor,
                  boxShadow: "0xp 0px 100px 0xp rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  width: "100%",
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
                      Restrictions
                    </InputLabel>
                    <TextField
                      fullWidth
                      // sx={{ width: "300px" }}
                      select
                      multiple
                      placeholder="Select"
                      value={multiInputValue}
                      onChange={handleSelectChange}
                    >
                      {propertyData?.map((places) => (
                        <MenuItem value={places}>{places?.name}</MenuItem>
                      ))}
                    </TextField>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", marginTop: 1 }}
                    >
                      {selectedValues.map((value) => (
                        <>
                          {console.log(value)}
                          <Chip
                            key={value}
                            label={value.name}
                            onDelete={handleDelete(value)}
                            sx={{
                              margin: 0.5,
                              background: "none",
                              border: `1px solid ${Colors.primary}`,
                              color: Colors.primary,
                            }}
                          />
                        </>
                      ))}
                    </Box>
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
                    {/* <FormControl component="fieldset">
                      <RadioGroup
                        name="recreational_drug"
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                        }}
                        value={drug}
                        onChange={(e) => setDrug(e.target.value)}
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Yes"
                          {...register4("recreational_drug")}
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="No"
                          {...register4("recreational_drug")}
                        />
                      </RadioGroup>
                    </FormControl> */}
                  </Grid>
                  <Grid item xs={12} md={5} sx={{ mb: 1 }}>
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

      <Modal
        open={messageModal}
        onClose={() => ""}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { md: "35%", xs: "74%", sm: "60%" },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            border: `4px solid ${Colors.primary}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <CheckCircle sx={{ color: "#65c545", fontSize: 40, mr: 1 }} />{" "}
            {/* Success icon */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: Colors.black,
                fontSize: { md: "18px", sm: "16px", sm: "16px" },
              }}
            >
              Account Created Successfully
            </Typography>
          </Box>

          <Box sx={{ fontSize: "16px", textAlign: "center" }}>
            {successMessage}
          </Box>

          <Box
            sx={{
              background: Colors.primary,
              color: Colors.white,
              textAlign: "center",
              margin: "0px auto",
              mt: 3,
              py: 1,
              width: "100px",
              cursor: "pointer",
              borderRadius: "12px",
            }}
            onClick={() => {
              setMessageModal(false);
              navigate("/login");
            }}
          >
            Ok
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EmployeeRegister;
