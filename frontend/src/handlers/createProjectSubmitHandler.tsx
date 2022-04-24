import apiPaths from "../properties/apiPaths";
import Router from "next/router";
import axios from "axios";
import { AxiosFormConfig } from "../api/calls/baseCalls";

export interface ProjectCreationValues {
    projectName: string;
    versionManagement: string;
    coach: string;
    partnerName: string;
    partnerWebsite: string;
    creator: string;
}

export type ProjectCreationProps = {
    submitHandler: (values: ProjectCreationValues) => void;
};

export async function createProjectSubmitHandler(values: ProjectCreationValues) {
    // store the states in the form data
    const createProjectFormData = new FormData();
    createProjectFormData.append("projectName", values.projectName);
    createProjectFormData.append("versionManagement", values.versionManagement);
    createProjectFormData.append("coach", values.coach);
    createProjectFormData.append("partnerName", values.partnerName);
    createProjectFormData.append("partnerWebsite", values.partnerWebsite);

    const ownUser = await axios.get(apiPaths.ownUser, AxiosFormConfig);
    createProjectFormData.append("creator", ownUser.data._links.self.split(apiPaths.base)[1]);

    const response = await axios.post(apiPaths.projects, createProjectFormData, AxiosFormConfig);
    console.log("RESPONSE");
    console.log(response);
    // redirect to the url specified in the response
    //await Router.push(response.request.responseURL);
    console.log("RESPONSE");
    console.log(response);
}
