import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import CreateProject from "../../../src/pages/projects/create";
import {
    getBaseActiveEdition,
    getBaseLinks,
    getBaseOkResponse,
    getBasePage,
    getBaseProject,
    getBaseProjectSkill,
    getBaseSkillType, getBaseTeapot,
    getBaseUser,
} from "../TestEntityProvider";
import { IUser, userCollectionName, UserRole } from "../../../src/api/entities/UserEntity";
import { ProjectForm } from "../../../src/components/project/projectForm/projectForm";
import userEvent from "@testing-library/user-event";
import { IProject, Project, projectFromIProject } from "../../../src/api/entities/ProjectEntity";
import { AxiosConf, extractIdFromApiEntityUrl, ManyToManyAxiosConf } from "../../../src/api/calls/baseCalls";
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
import {
    ProjectCreationValues,
    projectFormSubmitHandler,
} from "../../../src/handlers/projectFormSubmitHandler";
import applicationPaths from "../../../src/properties/applicationPaths";
import { ProjectSkill, projectSkillCollectionName } from "../../../src/api/entities/ProjectSkillEntity";

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

    let submitButton: HTMLElement;

    function baseComponentRenderCheck(component: RenderResult) {
        expect(component.getByTestId("projectname-input")).toBeInTheDocument();
        expect(component.getByTestId("projectinfo-input")).toBeInTheDocument();
        expect(component.getByTestId("versionmanagement-input")).toBeInTheDocument();
        expect(component.getByTestId("partnername-input")).toBeInTheDocument();
        expect(component.getByTestId("partnerwebsite-input")).toBeInTheDocument();
        expect(component.getByTestId("skillinfo-input")).toBeInTheDocument();
        expect(component.getByTestId("coach-input")).toBeInTheDocument();
        expect(component.getByTestId("skill-input")).toBeInTheDocument();
        expect(component.getByTestId("submit-project-form-button")).toBeInTheDocument();
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

        // All used string constants
        const testProjectName: string = "Test project";
        const testProjectInfo: string = "Test info";
        const testGoal: string = "Test goal";
        const testVersionManagement: string = "http://www.example.com/";
        const testPartnerName: string = "Test company";
        const testPartnerWebsite: string = "http://www.example.com/";
        const testSkillInfo: string = "Test skill info";

        describe("in creation mode", () => {
            let component: RenderResult;

            beforeEach(async () => {
                component = render(
                    makeCacheFree(() => enableUseEditionComponentWrapper(() => <ProjectForm />, edition))
                );

                submitButton = await component.findByTestId("submit-project-form-button");

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
            });

            it("renders", async () => {
                baseComponentRenderCheck(component);
            });

            it("fills in form", async () => {
                const projectName = component.getByTestId("projectname-input");
                const projectInfo = component.getByTestId("projectinfo-input");
                const projectGoal = component.getByTestId("item-list-input");
                const versionManagement = component.getByTestId("versionmanagement-input");
                const partnerName = component.getByTestId("partnername-input");
                const partnerWebsite = component.getByTestId("partnerwebsite-input");
                const skillInfo = component.getByTestId("skillinfo-input");
                const addGoalButton = component.getByTestId("item-list-add-button");
                const addCoachButton = component.getByTestId("add-coach-button");
                const addSkillButton = component.getByTestId("add-skill-button");

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
                await userEvent.click(submitButton);

                // All values passed to the handler, including correct skill(info)s and coaches
                const createValues: ProjectCreationValues = {
                    name: testProjectName,
                    info: testProjectInfo,
                    versionManagement: testVersionManagement,
                    partnerName: testPartnerName,
                    partnerWebsite: testPartnerWebsite,
                    goals: [testGoal],
                    addedSkills: [skillType.name],
                    addedSkillsInfo: [testSkillInfo],
                    coaches: [user._links.self.href],
                };

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    null,
                    createValues,
                    [],
                    [],
                    edition._links.self.href,
                    user,
                    expect.anything(),
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

            it("can remove an added goal", async () => {
                const projectGoal = component.getByTestId("item-list-input");
                const addGoalButton = component.getByTestId("item-list-add-button");

                window.confirm = jest.fn(() => true);

                await userEvent.type(projectGoal, testGoal);
                await userEvent.click(addGoalButton);

                // Expect goal to appear
                await component.findByText(testGoal);
                const removeGoalButton = await component.findByTestId("item-list-delete-button");

                await userEvent.click(removeGoalButton);

                expect(component.queryByText(testGoal)).not.toBeInTheDocument();
            });

            it("can remove an added coach", async () => {
                const addCoachButton = component.getByTestId("add-coach-button");

                await userEvent.click(addCoachButton);

                // Expect coach to appear
                expect(await component.findAllByText(user.callName)).toHaveLength(2);
                const removeCoachButton = await component.findByTestId("remove-added-coach-" + user.callName);

                window.confirm = jest.fn(() => true);

                await userEvent.click(removeCoachButton);

                expect(await component.findAllByText(user.callName)).toHaveLength(1);
            });

            it("can remove an added skilltype", async () => {
                const skillInfoField = component.getByTestId("skillinfo-input");
                const addSkillButton = component.getByTestId("add-skill-button");

                await userEvent.type(skillInfoField, testSkillInfo);
                await userEvent.click(addSkillButton);

                expect(await component.findAllByText(skillType.name)).toHaveLength(2);
                await component.findByText(testSkillInfo);

                const removeSkillButton = await component.findByTestId(
                    "remove-added-skill-" + skillType.name
                );

                window.confirm = jest.fn(() => true);

                await userEvent.click(removeSkillButton);

                expect(await component.findAllByText(skillType.name)).toHaveLength(1);
                expect(component.queryByText(testSkillInfo)).not.toBeInTheDocument();
            });
        });

        describe("in edit mode", () => {
            const project: IProject = getBaseProject("5");
            const additionalUser = getBaseUser("6", UserRole.coach, true);
            const additionalSkillType = getBaseSkillType("7");
            const projectSkill = getBaseProjectSkill("8");
            let component: RenderResult;

            let nonEditValues: ProjectCreationValues;

            async function nonEditProject() {
                await waitFor(() => {
                    expect(mockAxios.patch).toHaveBeenCalledWith(
                        project._links.self.href,
                        projectFromIProject(project, edition._links.self.href, user._links.self.href),
                        expect.anything()
                    );
                });
                await enableActForResponse(project._links.self.href, getBaseOkResponse(project));
            }

            async function nonEditCoaches() {
                await waitFor(() => {
                    expect(mockAxios.put).toHaveBeenCalledWith(
                        project._links.coaches.href,
                        nonEditValues.coaches.join("\n"),
                        ManyToManyAxiosConf
                    );
                });
                await enableActForResponse(project._links.coaches.href, getBaseOkResponse({}));
            }

            async function defaultReroute() {
                await waitFor(() => {
                    expect(mockRouter.asPath).toEqual(
                        "/" +
                            applicationPaths.projects +
                            "/" +
                            extractIdFromApiEntityUrl(project._links.self.href)
                    );
                });
            }

            beforeEach(async () => {
                additionalUser.callName = "Jeffrey";
                additionalSkillType.name = "Don't worry, be happy";
                nonEditValues = {
                    name: project.name,
                    info: project.info,
                    coaches: [additionalUser._links.self.href],
                    goals: project.goals,
                    partnerName: project.partnerName,
                    partnerWebsite: project.partnerWebsite,
                    addedSkills: [],
                    addedSkillsInfo: [],
                    versionManagement: project.versionManagement,
                };

                component = render(
                    makeCacheFree(() =>
                        enableUseEditionComponentWrapper(() => <ProjectForm project={project} />, edition)
                    )
                );

                submitButton = await component.findByTestId("submit-project-form-button");

                // Make sure there are at least one skillType and one user
                await enableActForResponse(
                    getAxiosCallWithEdition(apiPaths.userByEdition, edition),
                    getBaseOkResponse(getBasePage(apiPaths.users, userCollectionName, [user, additionalUser]))
                );
                await enableCurrentUser(user);
                await enableActForResponse(
                    { url: apiPaths.skillTypes },
                    getBaseOkResponse(
                        getBasePage(apiPaths.skillTypes, skillTypeCollectionName, [
                            skillType,
                            additionalSkillType,
                        ])
                    )
                );

                await enableActForResponse(
                    project._links.coaches.href,
                    getBaseOkResponse(
                        getBaseLinks(project._links.coaches.href, userCollectionName, [additionalUser])
                    )
                );

                await enableActForResponse(
                    project._links.neededSkills.href,
                    getBaseOkResponse(
                        getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, [
                            projectSkill,
                        ])
                    )
                );
            });

            it("renders", async () => {
                baseComponentRenderCheck(component);

                // In select option
                // In already assigned
                await component.findByText(additionalUser.callName);

                await component.findByText(projectSkill.name);
                await component.findByText(projectSkill.additionalInfo);

                await component.findByDisplayValue(project.name);
                await component.findByDisplayValue(project.info);
                await component.findByDisplayValue(project.partnerName);
                await component.findByDisplayValue(project.partnerWebsite);
                await Promise.all(project.goals.map((goal) => component.findByText(goal)));
                await component.findByDisplayValue(project.versionManagement);
            });

            it("Completely changes the input fields", async () => {
                const projectName = component.getByTestId("projectname-input");
                const projectInfo = component.getByTestId("projectinfo-input");
                const projectGoal = component.getByTestId("item-list-input");
                const versionManagement = component.getByTestId("versionmanagement-input");
                const partnerName = component.getByTestId("partnername-input");
                const partnerWebsite = component.getByTestId("partnerwebsite-input");
                const skillInfo = component.getByTestId("skillinfo-input");
                const addGoalButton = component.getByTestId("item-list-add-button");

                await userEvent.clear(projectName);
                await userEvent.clear(projectInfo);
                await userEvent.clear(projectGoal);
                await userEvent.clear(versionManagement);
                await userEvent.clear(partnerName);
                await userEvent.clear(partnerWebsite);
                await userEvent.clear(skillInfo);

                await userEvent.type(projectName, testProjectName);
                await userEvent.type(projectInfo, testProjectInfo);
                await userEvent.type(projectGoal, testGoal);
                await userEvent.type(versionManagement, testVersionManagement);
                await userEvent.type(partnerName, testPartnerName);
                await userEvent.type(partnerWebsite, testPartnerWebsite);
                await userEvent.type(skillInfo, testSkillInfo);

                await userEvent.click(addGoalButton);
                await userEvent.click(submitButton);

                // All values passed to the handler, including correct skill(info)s and coaches
                const createValues: ProjectCreationValues = {
                    name: testProjectName,
                    info: testProjectInfo,
                    versionManagement: testVersionManagement,
                    partnerName: testPartnerName,
                    partnerWebsite: testPartnerWebsite,
                    goals: [...project.goals, testGoal],
                    addedSkills: [],
                    addedSkillsInfo: [],
                    coaches: [additionalUser._links.self.href],
                };

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    project,
                    createValues,
                    [],
                    [],
                    edition._links.self.href,
                    user,
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                );

                // project creation & check if correct data is passed
                // Project that will be created
                const patchProject: Project = new Project(
                    testProjectName,
                    testProjectInfo,
                    testVersionManagement,
                    [...project.goals, testGoal],
                    testPartnerName,
                    testPartnerWebsite,
                    edition._links.self.href,
                    user._links.self.href
                );
                await waitFor(() => {
                    expect(mockAxios.patch).toHaveBeenCalledWith(
                        project._links.self.href,
                        patchProject,
                        expect.anything()
                    );
                });
                await enableActForResponse(project._links.self.href, getBaseOkResponse(project));

                await nonEditCoaches();

                await defaultReroute();
            }, 7000);

            it("removes a coach", async () => {
                const removeCoachButton = await component.findByTestId(
                    "remove-existing-coach-" + additionalUser.callName
                );

                window.confirm = jest.fn(() => true);

                await userEvent.click(removeCoachButton);
                await userEvent.click(submitButton);

                nonEditValues.coaches = [];

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    project,
                    nonEditValues,
                    [],
                    [],
                    edition._links.self.href,
                    user,
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                );

                await nonEditProject();

                // Coach linking
                await waitFor(() => {
                    expect(mockAxios.put).toHaveBeenCalledWith(
                        project._links.coaches.href,
                        nonEditValues.coaches.join("\n"),
                        ManyToManyAxiosConf
                    );
                });
                await enableActForResponse(project._links.coaches.href, getBaseOkResponse({}));

                await defaultReroute();
            });

            it("adds a coach", async () => {
                const userSelect = component.getByTestId("coach-input");
                const addCoachButton = component.getByTestId("add-coach-button");

                await userEvent.click(userSelect);

                const userOption = await component.findByTestId("user-select-" + user.callName);
                await userEvent.click(userOption);

                await userEvent.click(addCoachButton);

                await userEvent.click(submitButton);

                nonEditValues.coaches = [user._links.self.href, additionalUser._links.self.href];

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    project,
                    nonEditValues,
                    [],
                    [],
                    edition._links.self.href,
                    user,
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                );

                await nonEditProject();

                // Coach linking
                await waitFor(() => {
                    expect(mockAxios.put).toHaveBeenCalledWith(
                        project._links.coaches.href,
                        nonEditValues.coaches.join("\n"),
                        ManyToManyAxiosConf
                    );
                });
                await enableActForResponse(project._links.coaches.href, getBaseOkResponse({}));

                await defaultReroute();
            });

            it("existing users can not be selected", async () => {
                const userSelect = component.getByTestId("coach-input");
                const addCoachButton = component.getByTestId("add-coach-button");

                await userEvent.click(userSelect);

                const userOption = await component.findByTestId("user-select-" + additionalUser.callName);
                await userEvent.click(userOption);

                await userEvent.click(addCoachButton);

                await userEvent.click(submitButton);

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    project,
                    nonEditValues,
                    [],
                    [],
                    edition._links.self.href,
                    user,
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                );
            });

            it("removes project skills", async () => {
                const removeButton = await component.findByTestId(
                    "remove-existing-skill-" + projectSkill.name
                );

                window.confirm = jest.fn(() => true);

                await userEvent.click(removeButton);
                await userEvent.click(submitButton);

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    project,
                    nonEditValues,
                    [projectSkill._links.self.href],
                    [],
                    edition._links.self.href,
                    user,
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                );

                await nonEditProject();

                expect(mockAxios.delete).toHaveBeenCalledWith(projectSkill._links.self.href, AxiosConf);
                await enableActForResponse(projectSkill._links.self.href, getBaseOkResponse({}));

                await nonEditCoaches();

                await defaultReroute();
            });

            it("add project skills", async () => {
                const skillInfoField = component.getByTestId("skillinfo-input");
                const addSkillButton = component.getByTestId("add-skill-button");

                await userEvent.type(skillInfoField, testSkillInfo);
                await userEvent.click(addSkillButton);

                await userEvent.click(submitButton);

                nonEditValues.addedSkills = [skillType.name];
                nonEditValues.addedSkillsInfo = [testSkillInfo];

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    project,
                    nonEditValues,
                    [],
                    [],
                    edition._links.self.href,
                    user,
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                );

                await nonEditProject();

                // Project skill creation
                const createdProjectSkill = new ProjectSkill(
                    skillType.name,
                    testSkillInfo,
                    project._links.self.href
                );
                const responseProjectSkill = getBaseProjectSkill("20");
                await waitFor(() => {
                    expect(mockAxios.post).toHaveBeenCalledWith(
                        apiPaths.projectSkills,
                        createdProjectSkill,
                        expect.anything()
                    );
                });
                await enableActForResponse(apiPaths.projectSkills, getBaseOkResponse(responseProjectSkill));

                await nonEditCoaches();

                await defaultReroute();
            });

            it("edits project skills", async () => {
                const editSkillButton = await component.findByTestId(
                    "edit-existing-skill-" + projectSkill.name
                );

                await userEvent.click(editSkillButton);

                const editSkillInfoField = await component.findByTestId(
                    "edit-existing-skill-info-" + projectSkill.name
                );
                const applyEdit = await component.findByTestId(
                    "edit-existing-skill-submit-" + projectSkill.name
                );

                await userEvent.clear(editSkillInfoField);
                await userEvent.type(editSkillInfoField, testSkillInfo);

                await userEvent.click(applyEdit);
                await userEvent.click(submitButton);

                expect(submitProjectSpy).toHaveBeenCalledWith(
                    project,
                    nonEditValues,
                    [],
                    [
                        [
                            projectSkill._links.self.href,
                            new ProjectSkill(projectSkill.name, testSkillInfo, project._links.self.href),
                        ],
                    ],
                    edition._links.self.href,
                    user,
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                );

                await nonEditProject();

                // edit project skill
                const responseProjectSkill = getBaseProjectSkill("20");
                await waitFor(() => {
                    expect(mockAxios.patch).toHaveBeenCalledWith(
                        projectSkill._links.self.href,
                        { name: projectSkill.name, additionalInfo: testSkillInfo },
                        expect.anything()
                    );
                });
                await enableActForResponse(
                    projectSkill._links.self.href,
                    getBaseOkResponse(responseProjectSkill)
                );

                await nonEditCoaches();

                await defaultReroute();
            });
        });
    });

    describe("with error", () => {
        it("should handle error", async () => {
            console.log = jest.fn()

            const project: IProject = getBaseProject("5");
            const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");
            render(
                makeCacheFree(() =>
                    enableUseEditionComponentWrapper(() => <ProjectForm project={project} />, edition)
                )
            );
            await enableActForResponse({ url: project._links.coaches.href }, getBaseTeapot());

            await waitFor(() => expect(console.log).toHaveBeenCalled())
        });
    });
});
