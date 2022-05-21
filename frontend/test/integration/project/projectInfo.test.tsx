import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { enableActForResponse, makeCacheFree } from "../Provide";
import { ProjectInfo } from "../../../src/components/project/projectInfo";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../../src/properties/apiPaths";
import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";
import { AxiosResponse } from "axios";
import { userCollectionName, UserRole } from "../../../src/api/entities/UserEntity";
import { projectSkillCollectionName } from "../../../src/api/entities/ProjectSkillEntity";
import { assignmentCollectionName } from "../../../src/api/entities/AssignmentEntity";
import { skillTypeCollectionName } from "../../../src/api/entities/SkillTypeEntity";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";
import { getValidAssignmentsUrlForProjectSkill } from "../../../src/api/calls/AssignmentCalls";
import {
    getBaseAssignment,
    getBaseBadRequestResponse,
    getBaseLinks,
    getBaseNoContentResponse,
    getBaseOkResponse,
    getBasePage,
    getBaseProject,
    getBaseProjectSkill,
    getBaseSkillType,
    getBaseStudent,
    getBaseUser,
} from "../TestEntityProvider";

jest.mock("next/router", () => require("next-router-mock"));

describe("project info", () => {
    it("should render without data", () => {
        render(makeCacheFree(ProjectInfo));
    });

    it("should render with data", async () => {
        const projectId = "5";

        mockRouter.setCurrentUrl("/projects/" + projectId);
        mockRouter.query = { id: projectId };
        render(makeCacheFree(ProjectInfo));

        const project = getBaseProject(projectId);
        const user = getBaseUser("6", UserRole.admin, true);
        const projectSkill = getBaseProjectSkill("7");
        const skillType = getBaseSkillType("8");
        skillType.name = projectSkill.name;
        const assignment = getBaseAssignment("9");
        const student = getBaseStudent("10");

        await waitFor(() =>
            mockAxios.mockResponseFor(
                { url: apiPaths.projects + "/" + projectId },
                getBaseOkResponse(project)
            )
        );

        await waitFor(() =>
            mockAxios.mockResponseFor(
                project._links.coaches.href,
                getBaseOkResponse(getBaseLinks(project._links.coaches.href, userCollectionName, [user]))
            )
        );

        await waitFor(() =>
            mockAxios.mockResponseFor(
                project._links.neededSkills.href,
                getBaseOkResponse(
                    getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, [projectSkill])
                )
            )
        );

        await waitFor(() =>
            mockAxios.mockResponseFor(
                getQueryUrlFromParams(apiPaths.skillTypesByName, { name: skillType.name }),
                getBaseOkResponse(
                    getBasePage(apiPaths.skillTypesByName, skillTypeCollectionName, [skillType])
                )
            )
        );

        const assignmentsUrl = getValidAssignmentsUrlForProjectSkill(projectSkill);
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { url: assignmentsUrl },
                getBaseOkResponse(getBasePage(assignmentsUrl, assignmentCollectionName, [assignment]))
            )
        );

        await waitFor(() =>
            mockAxios.mockResponseFor({ url: assignment._links.student.href }, getBaseOkResponse(student))
        );

        await waitFor(() => expect(screen.getByText(student.callName)).toBeInTheDocument());
    });

    it("should delete", async () => {
        const projectId = "5";

        mockRouter.setCurrentUrl("/projects/" + projectId);
        mockRouter.query = { id: projectId };
        render(makeCacheFree(ProjectInfo));

        const project = getBaseProject(projectId);
        await waitFor(() =>
            mockAxios.mockResponseFor(apiPaths.projects + "/" + projectId, getBaseOkResponse(project))
        );

        const deleteButton = await screen.findByTestId("delete-project");
        await userEvent.click(deleteButton);

        await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled());
        const response: AxiosResponse = getBaseNoContentResponse();
        await enableActForResponse({ url: project._links.self.href }, response);
    });

    it("delete should fail", async () => {
        const projectId = "5";

        mockRouter.setCurrentUrl("/projects/" + projectId);
        mockRouter.query = { id: projectId };
        render(makeCacheFree(ProjectInfo));

        const project = getBaseProject(projectId);
        await waitFor(() =>
            mockAxios.mockResponseFor(apiPaths.projects + "/" + projectId, getBaseOkResponse(project))
        );

        const deleteButton = await screen.findByTestId("delete-project");
        await userEvent.click(deleteButton);

        await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled());
        const response: AxiosResponse = getBaseBadRequestResponse();
        await enableActForResponse({ url: project._links.self.href }, response);

        const warning = await screen.findByTestId("warning");
        await waitFor(() => {
            expect(warning).toBeVisible();
        });
    });
});
