import { getAllAssignmentsFromPage, getValidAssignmentsUrlForStudent } from "../api/calls/AssignmentCalls";
import { useSwrForEntityList } from "./utilHooks";
import { SWRResponse } from "swr";
import { IAssignment } from "../api/entities/AssignmentEntity";

export function useValidAssignmentsFromStudentList(studentUrl: string): SWRResponse<IAssignment[], any> {
    const assignmentsUrl = getValidAssignmentsUrlForStudent(studentUrl);
    return useSwrForEntityList(assignmentsUrl, getAllAssignmentsFromPage);
}
