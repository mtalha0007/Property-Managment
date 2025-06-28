import {SkillRoutes } from "./skill.route";
import { post, get, put,patch } from "../index";


const SkillServices = {
  addSkill: async (obj) => {
    let result = post(SkillRoutes.addSkill ,obj );
    return result;
  },
  addCode: async (obj) => {
    let result = post(SkillRoutes.addCode ,obj );
    return result;
  },
  getSkill: async (skill) => {
    let result = get(SkillRoutes.getSkill + `?type=${skill}` );
    return result;
  },
  getCode: async (skill) => {
    let result = get(SkillRoutes.getCode );
    return result;
  },
 

};

export default SkillServices;
