import { useSwrForEntityListWithEdition } from "./utilHooks";
import {
    constructStudentQueryUrl,
    getAllStudentsFromPage,
    IStudentQueryParams,
} from "../api/calls/studentCalls";
import apiPaths from "../properties/apiPaths";
import { useRouter } from "next/router";
import { getStudentQueryParamsFromQuery } from "../components/student/studentFilterComponent";
import { SWRResponse } from "swr";
import { IStudent } from "../api/entities/StudentEntity";

export default function useQueriedStudents(): SWRResponse<IStudent[], any> {
    const router = useRouter();
    const params: IStudentQueryParams = getStudentQueryParamsFromQuery(router.query);

    const queryUrl = constructStudentQueryUrl(apiPaths.studentByQuery, params);
    return useSwrForEntityListWithEdition(queryUrl, getAllStudentsFromPage);
}
