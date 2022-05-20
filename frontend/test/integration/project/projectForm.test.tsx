import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CreateProject from "../../../src/pages/projects/create";
import {
    getBaseActiveEdition,
    getBaseOkResponse,
    getBasePage,
    getBaseProject,
    getBaseProjectSkill,
    getBaseSkillType,
    getBaseUser,
} from "../TestEntityProvider";
import { IUser, userCollectionName, UserRole } from "../../../src/api/entities/UserEntity";
import { ProjectForm } from "../../../src/components/project/projectForm/projectForm";
import userEvent from "@testing-library/user-event";
import { IProject, Project } from "../../../src/api/entities/ProjectEntity";
import { extractIdFromApiEntityUrl, ManyToManyAxiosConf } from "../../../src/api/calls/baseCalls";
import { ISkillType, skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";
import { IEdition } from "../../../src/api/entities/EditionEntity";
import {
    enableActForResponse,
    enableCurrentUser,
    enableUseEditionComponentWrapper,
    getAxiosCallWithEdition,
    makeCacheFree,
} from "../Provide";
import mockRouter from "next-router-mock";
import { extractIdFromUserUrl } from "../../../src/api/calls/userCalls";
import {
    ProjectCreationValues,
    projectFormSubmitHandler,
} from "../../../src/handlers/projectFormSubmitHandler";
import applicationPaths from "../../../src/properties/applicationPaths";
import { ProjectSkill } from "../../../src/api/entities/ProjectSkillEntity";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
});

describe("Create project form", () => {
    let submitProjectSpy: jest.SpyInstance<any, unknown[]>;
    beforeEach(() => {
        submitProjectSpy = jest.spyOn(
            require("../../../src/handlers/projectFormSubmitHandler"),
            "projectFormSubmitHandler"
        );
    });

    function baseComponentRenderCheck(component: RenderResult) {
        expect(component.getByTestId("projectname-input")).toBeInTheDocument();
        expect(component.getByTestId("projectinfo-input")).toBeInTheDocument();
        expect(component.getByTestId("versionmanagement-input")).toBeInTheDocument();
        expect(component.getByTestId("partnername-input")).toBeInTheDocument();
        expect(component.getByTestId("partnerwebsite-input")).toBeInTheDocument();
        expect(component.getByTestId("skillinfo-input")).toBeInTheDocument();
        expect(component.getByTestId("coach-input")).toBeInTheDocument();
        expect(component.getByTestId("skill-input")).toBeInTheDocument();
        expect(component.getByTestId("create-project-button")).toBeInTheDocument();
        expect(component.getByTestId("add-coach-button")).toBeInTheDocument();
        expect(component.getByTestId("add-skill-button")).toBeInTheDocument();
    }

    describe("without data", () => {
        it("renders all components", async () => {
            const user: IUser = getBaseUser("1", UserRole.admin, true);
            const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");

            const component: RenderResult = render(
                makeCacheFree(() => enableUseEditionComponentWrapper(CreateProject, edition))
            );
            await enableCurrentUser(user);

            await baseComponentRenderCheck(component);
        });
    });

    describe("with data", () => {
        // All used base entities
        const skillType: ISkillType = getBaseSkillType("1");
        const user: IUser = getBaseUser("2", UserRole.admin, true);
        const edition: IEdition = getBaseActiveEdition("3", "OSOC-2022");

        async function answerBaseObjects() {
            // Make sure there are at least one skillType and one user
            await enableActForResponse(
                getAxiosCallWithEdition(apiPaths.userByEdition, edition),
                getBaseOkResponse(getBasePage(apiPaths.users, userCollectionName, [user]))
            );
            await enableCurrentUser(user);
            await enableActForResponse(
                { url: apiPaths.skillTypes },
                getBaseOkResponse(getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [skillType]))
            );
        }

        describe("in creation mode", () => {
            // All used string constants
            const testProjectName: string = "Test project";
            const testProjectInfo: string = "Test info";
            const testGoal: string = "Test goal";
            const testVersionManagement: string = "http://www.example.com/";
            const testPartnerName: string = "Test company";
            const testPartnerWebsite: string = "http://www.example.com/";
            const testSkillInfo: string = "Test skill info";

            let component: RenderResult;

            beforeEach(() => {
                component = render(
                    makeCacheFree(() => enableUseEditionComponentWrapper(() => <ProjectForm />, edition))
                );
                answerBaseObjects();
            });

            it("renders", async () => {
                baseComponentRenderCheck(component);

                await component.findByText(user.callName);
                await component.findByText(skillType.name);
            });

            it("fills in form", async () => {
                const projectName = component.getByTestId("projectname-input");
                const projectInfo = component.getByTestId("projectinfo-input");
                const projectGoal = component.getByTestId("goal-input");
                const versionManagement = component.getByTestId("versionmanagement-input");
                const partnerName = component.getByTestId("partnername-input");
                const partnerWebsite = component.getByTestId("partnerwebsite-input");
                const skillInfo = component.getByTestId("skillinfo-input");
                const addGoalButton = component.getByTestId("add-goal-button");
                const addCoachButton = component.getByTestId("add-coach-button");
                const addSkillButton = component.getByTestId("add-skill-button");
                const createProjectButton = component.getByTestId("create-project-button");

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
                    goals: [testGoal],
                    skills: [skillType.name],
                    skillInfos: [testSkillInfo],
                    coaches: [user._links.self.href],
                };

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    null,
                    createValues,
                    [],
                    [],
                    [],
                    edition._links.self.href,
                    user,
                    mockRouter,
                    expect.anything(),
                    expect.anything()
                );

                // project creation & check if correct data is passed
                // Project that will be created
                const project: Project = new Project(
                    testProjectName,
                    testProjectInfo,
                    testVersionManagement,
                    [testGoal],
                    testPartnerName,
                    testPartnerWebsite,
                    edition._links.self.href,
                    user._links.self.href
                );
                const projectResponse = getBaseProject("10");
                await waitFor(() => {
                    expect(mockAxios.post).toHaveBeenCalledWith(
                        apiPaths.projects,
                        project,
                        expect.anything()
                    );
                });
                await enableActForResponse(apiPaths.projects, getBaseOkResponse(projectResponse));

                // Project skill creation
                const projectSkill = new ProjectSkill(
                    skillType.name,
                    testSkillInfo,
                    projectResponse._links.self.href
                );
                const responseProjectSkill = getBaseProjectSkill("11");
                await waitFor(() => {
                    expect(mockAxios.post).toHaveBeenCalledWith(
                        apiPaths.projectSkills,
                        projectSkill,
                        expect.anything()
                    );
                });
                await enableActForResponse(apiPaths.projectSkills, getBaseOkResponse(responseProjectSkill));

                // Coach linking
                await waitFor(() => {
                    expect(mockAxios.put).toHaveBeenCalledWith(
                        projectResponse._links.coaches.href,
                        user._links.self.href,
                        ManyToManyAxiosConf
                    );
                });
                await enableActForResponse(projectResponse._links.coaches.href, getBaseOkResponse({}));

                await waitFor(() => {
                    expect(mockRouter.asPath).toEqual(
                        "/" +
                            applicationPaths.projects +
                            "/" +
                            extractIdFromApiEntityUrl(projectResponse._links.self.href)
                    );
                });
            });
        });

        describe("in edit mode", () => {
            const project: IProject = getBaseProject("5");

            it("renders", () => {});

            it("removes a coach", () => {});

            it("adds a coach", () => {});

            it("removes project skills", () => {});

            it("add project skills", () => {});

            it("edits project skills", () => {});

            it("makes sure an existing user can not be selected", () => {});
        });
    });

    /*
    it("Filling in form and submitting it", async () => {
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
            edition: apiPaths.editions + "/" + extractIdFromApiEntityUrl(edition._links.self.href),
            creator: apiPaths.users + "/" + extractIdFromApiEntityUrl(user._links.self.href),
            goals: [testGoal],
            skills: [skillType.name],
            skillInfos: [testSkillInfo],
            coaches: [user._links.self.href],
        };

        // Project that will be created
        const project: Project = new Project(
            testProjectName,
            testProjectInfo,
            testVersionManagement,
            [testGoal],
            testPartnerName,
            testPartnerWebsite,
            edition._links.self.href,
            apiPaths.users + "/" + extractIdFromUserUrl(user._links.self.href)
        );

        await waitFor(() => {
            projectFormSubmitHandler(
                createValues,
                mockRouter,
                edition._links.self.href,
                user,
                async () => {},
                (x) => x
            );
        });

        // Check if project is posted with correct value
        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.projects, project, expect.anything());
        });
    });
    */
});
