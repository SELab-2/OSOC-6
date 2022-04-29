import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import apiPaths from "../src/properties/apiPaths";
import CreateProject from "../src/pages/projects/create";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
    createProjectSubmitHandler,
    ProjectCreationValues,
} from "../src/handlers/createProjectSubmitHandler";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

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

it("SubmitHandler for createProject sends post request", async () => {
    const values: ProjectCreationValues = {
        projectName: "Test project",
        projectInfo: "This is a test project",
        versionManagement: "https://github.com/Test",
        partnerName: "Test company",
        partnerWebsite: "testcompany.com",
        coaches: [],
        skills: [],
        skillInfos: [],
    };

    const ownUserResponse: AxiosResponse = {
        data: {
            _links: {
                self: {
                    href: "/users/1",
                },
            },
        },
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        headers: {},
        config: {},
    };

    createProjectSubmitHandler(values); //, [], [], []);
    mockAxios.mockResponseFor({ url: apiPaths.ownUser }, ownUserResponse);

    waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.projects, expect.anything(), expect.anything());
    });
});
