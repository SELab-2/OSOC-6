import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { enableActForResponse, enableCurrentUser, makeCacheFree } from "../Provide";
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
    getBaseStudent, getBaseTeapot,
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

        await enableActForResponse({ url: apiPaths.projects + "/" + projectId }, getBaseOkResponse(project));

        await enableActForResponse(
            project._links.coaches.href,
            getBaseOkResponse(getBaseLinks(project._links.coaches.href, userCollectionName, [user]))
        );

        await enableActForResponse(
            project._links.neededSkills.href,
            getBaseOkResponse(
                getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, [projectSkill])
            )
        );

        await enableActForResponse(
            getQueryUrlFromParams(apiPaths.skillTypesByName, { name: skillType.name }),
            getBaseOkResponse(getBasePage(apiPaths.skillTypesByName, skillTypeCollectionName, [skillType]))
        );

        const assignmentsUrl = getValidAssignmentsUrlForProjectSkill(projectSkill._links.self.href);
        await enableActForResponse(
            { url: assignmentsUrl },
            getBaseOkResponse(getBasePage(assignmentsUrl, assignmentCollectionName, [assignment]))
        );

        await enableActForResponse({ url: assignment._links.student.href }, getBaseOkResponse(student));

        await waitFor(() => expect(screen.getByText(student.callName)).toBeInTheDocument());
    });

    it("should delete", async () => {
        const projectId = "5";

        mockRouter.setCurrentUrl("/projects/" + projectId);
        mockRouter.query = { id: projectId };
        render(makeCacheFree(ProjectInfo));
        await enableCurrentUser(getBaseUser("5", UserRole.admin, true));

        const project = getBaseProject(projectId);
        await enableActForResponse(apiPaths.projects + "/" + projectId, getBaseOkResponse(project));

        window.confirm = jest.fn(() => true);

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
        await enableCurrentUser(getBaseUser("5", UserRole.admin, true));

        const project = getBaseProject(projectId);
        await enableActForResponse(apiPaths.projects + "/" + projectId, getBaseOkResponse(project));

        window.confirm = jest.fn(() => true);

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

    it("delete should not be visible", async () => {
        const projectId = "5";

        mockRouter.setCurrentUrl("/projects/" + projectId);
        mockRouter.query = { id: projectId };
        render(makeCacheFree(ProjectInfo));
        await enableCurrentUser(getBaseUser("5", UserRole.coach, true));

        const project = getBaseProject(projectId);
        await enableActForResponse(apiPaths.projects + "/" + projectId, getBaseOkResponse(project));

        await waitFor(() => {
            expect(screen.queryByTestId("delete-project")).not.toBeInTheDocument();
        });
    });

    it("should handle error", async () => {
        const projectId = "5";
        console.log = jest.fn();

        mockRouter.setCurrentUrl("/projects/" + projectId);
        mockRouter.query = { id: projectId };

        render(makeCacheFree(ProjectInfo));
        await enableCurrentUser(getBaseUser("5", UserRole.coach, true));

        await enableActForResponse(apiPaths.projects + "/" + projectId, getBaseTeapot());

        await waitFor(() => {
            expect(console.log).toHaveBeenCalled();
        });
    });
});
