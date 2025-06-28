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
        skill_type:formData.skillType,
        category:formData.category,
        skill:formData.skill,
    }
    try {
        const { data, responseCode, message } = await SkillServices.addSkill(obj);
          SuccessToaster(message);
          console.log(responseCode);
        } catch (error) {
          ErrorHandler(error)
          ErrorToaster(error.message);
          console.log(error.message);
        }
   
  };
  return (
    <Box component={"form"} onSubmit={handleSubmit(createSkill)}>
      <Grid container spacing={2} sx={{ mt: 12, pl: 2 }}>
        <Grid item md={5}>
          <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
            Skill Type
          </InputLabel>
          <TextField
            fullWidth
            select
            {...register("skillType", {
              required: "Skill Type is required",
            })}
            error={errors.skillType && true}
            helperText={errors?.skillType?.message}
            value={skillType}
            onChange={(e) => setSkillType(e.target.value)}
          >
            {skillTypeArray.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item md={5}>
          <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
            Category
          </InputLabel>
          <TextField
            fullWidth
            text
            {...register("category", {
              required: "Category is required",
            })}
            error={errors.category && true}
            helperText={errors?.category?.message}
          ></TextField>
        </Grid>
        <Grid item md={5}>
          <InputLabel sx={{ fontWeight: "bold", color: Colors.black }}>
            Skill
          </InputLabel>
          <TextField
            fullWidth
            text
            {...register("skill", {
              required: "Skill is required",
            })}
            error={errors.skill && true}
            helperText={errors?.skill?.message}
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
