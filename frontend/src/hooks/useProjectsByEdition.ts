import { useSwrForEntityListWithEdition } from "./utilHooks";
import apiPaths from "../properties/apiPaths";
import { getAllProjectsFromPage } from "../api/calls/projectCalls";
import { IProject } from "../api/entities/ProjectEntity";
import { SWRResponse } from "swr";

/**
 * Hook that return projects from current edition.
 * Hook is specified so the delete button and the list always use the same url (by using this hook).
 */
export default function useProjectsByEdition(): SWRResponse<IProject[], any> {
    return useSwrForEntityListWithEdition(apiPaths.projectsByEdition, getAllProjectsFromPage);
}
