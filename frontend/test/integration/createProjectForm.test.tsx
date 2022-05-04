import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import apiPaths from "../src/properties/apiPaths";
import CreateProject from "../src/pages/projects/create";
import {
    createProjectSubmitHandler,
    ProjectCreationValues,
} from "../src/handlers/createProjectSubmitHandler";
import { getBaseOkResponse, getBaseUser } from "./TestEntityProvider";
import { UserRole } from "../src/api/entities/UserEntity";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Create project form", () => {
    describe("CreateProjectForm initialization", () => {
        it("Should call axios.get() upon rendering", () => {
            render(<CreateProject />);
            expect(mockAxios.get).toHaveBeenCalled();

            expect(screen.getByTestId("projectname-input")).toBeInTheDocument();
            expect(screen.getByTestId("projectinfo-input")).toBeInTheDocument();
            expect(screen.getByTestId("versionmanagement-input")).toBeInTheDocument();
            expect(screen.getByTestId("partnername-input")).toBeInTheDocument();
            expect(screen.getByTestId("partnerwebsite-input")).toBeInTheDocument();
            expect(screen.getByTestId("skillinfo-input")).toBeInTheDocument();
            expect(screen.getByTestId("coach-input")).toBeInTheDocument();
            expect(screen.getByTestId("skill-input")).toBeInTheDocument();
        });
    });

    describe("Submit the form", () => {
        it("SubmitHandler for createProject sends post request", async () => {
            const values: ProjectCreationValues = {
                projectName: "Test project",
                projectInfo: "This is a test project",
                versionManagement: "http://www.example.com/",
                partnerName: "Test company",
                partnerWebsite: "testcompany.com",
                coaches: [],
                skills: [],
                skillInfos: [],
            };

            const ownUserResponse: AxiosResponse = getBaseOkResponse(getBaseUser("1", UserRole.admin, true));

            createProjectSubmitHandler(values);
            mockAxios.mockResponseFor({ url: apiPaths.ownUser }, ownUserResponse);

            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalledWith(
                    apiPaths.projects,
                    expect.anything(),
                    expect.anything()
                );
            });
        });
    });
});
