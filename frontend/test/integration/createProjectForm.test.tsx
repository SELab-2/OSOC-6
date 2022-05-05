import "@testing-library/jest-dom";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import apiPaths from "../../src/properties/apiPaths";
import CreateProject from "../../src/pages/projects/create";
import {
    createProjectSubmitHandler,
    ProjectCreationValues,
} from "../../src/handlers/createProjectSubmitHandler";
import { getBaseActiveEdition, getBaseOkResponse, getBaseSkillType, getBaseUser } from "./TestEntityProvider";
import { IUser, User, UserRole } from "../../src/api/entities/UserEntity";
import { CreateProjectForm } from "../../src/components/createProjectForm";
import userEvent from "@testing-library/user-event";
import { Project } from "../../src/api/entities/ProjectEntity";
import { getEntityFromFullUrl } from "../../src/api/calls/baseCalls";
import { ISkillType, SkillType } from "../../src/api/entities/SkillTypeEntity";
import { IEdition } from "../../src/api/entities/EditionEntity";

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

    describe("Create a project", () => {
        it("Filling in form and submitting it", async () => {
            const submitProject = jest.fn();

            // All used string constants
            const testProjectName: string = "Test project";
            const testProjectInfo: string = "Test info";
            const testVersionManagement: string = "http://www.example.com/";
            const testPartnerName: string = "Test company";
            const testPartnerWebsite: string = "http://www.example.com/";
            const testSkillInfo: string = "Test skill info";

            // All used base entities
            const baseSkillType: ISkillType = getBaseSkillType("1");
            const ownUser: IUser = getBaseUser("1", UserRole.admin, true);
            const baseUser: IUser = getBaseUser("2", UserRole.admin, true);
            const baseEdition: IEdition = getBaseActiveEdition("1", "OSOC-2022");

            const skillTypeResponse: AxiosResponse = getBaseOkResponse(baseSkillType);
            const userResponse: AxiosResponse = getBaseOkResponse(baseUser);

            const projectCreate: RenderResult = render(<CreateProjectForm submitHandler={submitProject} />);
            // Make sure there are at least one skillType and one user
            await waitFor(() => mockAxios.mockResponseFor({ url: apiPaths.users }, userResponse));
            await waitFor(() => mockAxios.mockResponseFor({ url: apiPaths.skillTypes }, skillTypeResponse));

            // All form components
            const projectName = projectCreate.getByTestId("projectname-input");
            const projectInfo = projectCreate.getByTestId("projectinfo-input");
            const versionManagement = projectCreate.getByTestId("versionmanagement-input");
            const partnerName = projectCreate.getByTestId("partnername-input");
            const partnerWebsite = projectCreate.getByTestId("partnerwebsite-input");
            const skillInfo = projectCreate.getByTestId("skillinfo-input");
            const addCoachButton = projectCreate.getByTestId("add-coach-button");
            const addSkillButton = projectCreate.getByTestId("add-skill-button");
            const createProjectButton = projectCreate.getByTestId("create-project-button");

            // Fill in the form
            await userEvent.type(projectName, testProjectName);
            await userEvent.type(projectInfo, testProjectInfo);
            await userEvent.type(versionManagement, testVersionManagement);
            await userEvent.type(partnerName, testPartnerName);
            await userEvent.type(partnerWebsite, testPartnerWebsite);
            await userEvent.type(skillInfo, testSkillInfo);

            await userEvent.click(addCoachButton);
            await userEvent.click(addSkillButton);
            await userEvent.click(createProjectButton);

            // All values passed to the handler, including correct skill(info)s and coaches
            const createValues: ProjectCreationValues = {
                name: testProjectName,
                info: testProjectInfo,
                versionManagement: testVersionManagement,
                partnerName: testPartnerName,
                partnerWebsite: testPartnerWebsite,
                edition: getEntityFromFullUrl(baseEdition._links.self.href),
                creator: getEntityFromFullUrl(ownUser._links.self.href),
                goals: [],
                skills: [baseSkillType.name],
                skillInfos: [testSkillInfo],
                coaches: [baseUser._links.self.href],
            };

            // Project that will be created
            const project: Project = new Project(
                testProjectName,
                testProjectInfo,
                testVersionManagement,
                [],
                testPartnerName,
                testPartnerWebsite,
                getEntityFromFullUrl(baseEdition._links.self.href),
                getEntityFromFullUrl(ownUser._links.self.href)
            );

            await waitFor(() => {
                createProjectSubmitHandler(createValues);
            });

            const ownUserResponse: AxiosResponse = getBaseOkResponse(getBaseUser("1", UserRole.admin, true));
            mockAxios.mockResponseFor({ url: apiPaths.ownUser }, ownUserResponse);

            // Check if project is posted with correct value
            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.projects, project, expect.anything());
            });
        });
    });
});
