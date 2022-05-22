import { useSwrForEntityListWithEdition } from "./utilHooks";
import apiPaths from "../properties/apiPaths";
import { getAllStudentsFromPage } from "../api/calls/studentCalls";
import { IStudent } from "../api/entities/StudentEntity";
import { SWRResponse } from "swr";

export default function useConflictStudents(): SWRResponse<IStudent[], any> {
    return useSwrForEntityListWithEdition(apiPaths.studentConflict, getAllStudentsFromPage);
}
