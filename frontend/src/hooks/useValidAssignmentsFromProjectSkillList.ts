import { IProjectSkill } from "../api/entities/ProjectSkillEntity";
import {
    getAllAssignmentsFromPage,
    getValidAssignmentsUrlForProjectSkill,
} from "../api/calls/AssignmentCalls";
import { useSwrForEntityList } from "./utilHooks";
import { IAssignment } from "../api/entities/AssignmentEntity";
import { SWRResponse } from "swr";

export default function useValidAssignmentsFromProjectSkillList(
    projectSkillUrl: string | null
): SWRResponse<IAssignment[], any> {
    const assignmentsUrl = projectSkillUrl ? getValidAssignmentsUrlForProjectSkill(projectSkillUrl) : null;
    return useSwrForEntityList(assignmentsUrl, getAllAssignmentsFromPage);
}
