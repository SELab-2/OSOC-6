import "@testing-library/jest-dom";
import { act, render, RenderResult, screen, waitFor } from "@testing-library/react";
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
import { extractIdFromApiEntityUrl } from "../../src/api/calls/baseCalls";
import { ISkillType, SkillType } from "../../src/api/entities/SkillTypeEntity";
import { IEdition } from "../../src/api/entities/EditionEntity";
import { makeCacheFree } from "./Provide";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
});

describe("Create project form", () => {
    it("Should render all components", () => {
        render(makeCacheFree(CreateProject));

        expect(screen.getByTestId("projectname-input")).toBeInTheDocument();
        expect(screen.getByTestId("projectinfo-input")).toBeInTheDocument();
        expect(screen.getByTestId("versionmanagement-input")).toBeInTheDocument();
        expect(screen.getByTestId("partnername-input")).toBeInTheDocument();
        expect(screen.getByTestId("partnerwebsite-input")).toBeInTheDocument();
        expect(screen.getByTestId("skillinfo-input")).toBeInTheDocument();
        expect(screen.getByTestId("coach-input")).toBeInTheDocument();
        expect(screen.getByTestId("skill-input")).toBeInTheDocument();
        expect(screen.getByTestId("create-project-button")).toBeInTheDocument();
        expect(screen.getByTestId("add-coach-button")).toBeInTheDocument();
        expect(screen.getByTestId("add-skill-button")).toBeInTheDocument();
    });

    it("Filling in form and submitting it", async () => {
        const submitProject = jest.fn();

        // All used string constants
        const testProjectName: string = "Test project";
        const testProjectInfo: string = "Test info";
        const testGoal: string = "Test goal";
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
        mockAxios.mockResponseFor({ url: apiPaths.users }, userResponse);
        mockAxios.mockResponseFor({ url: apiPaths.skillTypes }, skillTypeResponse);

        // All form components
        const projectName = projectCreate.getByTestId("projectname-input");
        const projectInfo = projectCreate.getByTestId("projectinfo-input");
        const projectGoal = projectCreate.getByTestId("goal-input");
        const versionManagement = projectCreate.getByTestId("versionmanagement-input");
        const partnerName = projectCreate.getByTestId("partnername-input");
        const partnerWebsite = projectCreate.getByTestId("partnerwebsite-input");
        const skillInfo = projectCreate.getByTestId("skillinfo-input");
        const addGoalButton = projectCreate.getByTestId("add-goal-button");
        const addCoachButton = projectCreate.getByTestId("add-coach-button");
        const addSkillButton = projectCreate.getByTestId("add-skill-button");
        const createProjectButton = projectCreate.getByTestId("create-project-button");

        // Fill in the form
        await userEvent.type(projectName, testProjectName);
        await userEvent.type(projectInfo, testProjectInfo);
        await userEvent.type(projectGoal, testGoal);
        await userEvent.type(versionManagement, testVersionManagement);
        await userEvent.type(partnerName, testPartnerName);
        await userEvent.type(partnerWebsite, testPartnerWebsite);
        await userEvent.type(skillInfo, testSkillInfo);

        await userEvent.click(addGoalButton);
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
            edition: apiPaths.editions + "/" + extractIdFromApiEntityUrl(baseEdition._links.self.href),
            creator: apiPaths.users + "/" + extractIdFromApiEntityUrl(ownUser._links.self.href),
            goals: [testGoal],
            skills: [baseSkillType.name],
            skillInfos: [testSkillInfo],
            coaches: [baseUser._links.self.href],
        };

        // Project that will be created
        const project: Project = new Project(
            testProjectName,
            testProjectInfo,
            testVersionManagement,
            [testGoal],
            testPartnerName,
            testPartnerWebsite,
            apiPaths.editions + "/" + extractIdFromApiEntityUrl(baseEdition._links.self.href),
            apiPaths.users + "/" + extractIdFromApiEntityUrl(ownUser._links.self.href)
        );

        await waitFor(() => {
            createProjectSubmitHandler(createValues, mockRouter);
        });

        const ownUserResponse: AxiosResponse = getBaseOkResponse(getBaseUser("1", UserRole.admin, true));
        mockAxios.mockResponseFor({ url: apiPaths.ownUser }, ownUserResponse);

        // Check if project is posted with correct value
        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.projects, project, expect.anything());
        });
    });
});
