import React, { useState } from "react";
import { Box, Button, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import Colors from "../../../assets/styles/index"; // Adjust the import according to your project structure
import SkillServices from "../../../api/SkillServices/skill.index";
import { ErrorToaster, SuccessToaster } from "../../../components/Toaster";
import { ErrorHandler } from "../../../utils/ErrorHandler";

export default function Index() {
  const [skillType, setSkillType] = useState("");
  const skillTypeArray = [
    "Leasing Consultant",
    "Grounds/Housekeeping",
    "Lead Maintenance/Asst Maint",
    "Manager/Assistant",
    "Asst Maintanace/Make ready",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const createSkill = async(formData) => {
    const obj ={
       code:formData.code
    }
    try {
        const { data, responseCode, message } = await SkillServices.addCode(obj);
    
          console.log(data);
        } catch (error) {
          console.log(error.message);
        }
   
  };
  return (
    <Box component={"form"} onSubmit={handleSubmit(createSkill)}>
      <Grid container spacing={2} sx={{ mt: 12, pl: 2 }}>
       
        <Grid item md={5}>
          <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
            Code
          </InputLabel>
          <TextField
            fullWidth
            text
            {...register("code", {
              required: "Code is required",
            })}
            error={errors.code && true}
            helperText={errors?.code?.message}
          ></TextField>
        </Grid>
        

        <Grid item md={12}>
        <Button type="submit" variant="contained" color="primary">
                 Submit
                </Button>
        </Grid>
      </Grid>

    </Box>
  );
}
