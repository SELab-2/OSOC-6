import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import { ProjectInfo } from "../../src/components/projectInfo";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../src/properties/apiPaths";
import mockRouter from "next-router-mock";
import {
    getBaseAssignment,
    getBaseLinks,
    getBaseOkResponse,
    getBasePage,
    getBaseProject,
    getBaseProjectSkill,
    getBaseSkillType,
    getBaseStudent,
    getBaseUser,
} from "./TestEntityProvider";
import { userCollectionName, UserRole } from "../../src/api/entities/UserEntity";
import { projectSkillCollectionName } from "../../src/api/entities/ProjectSkillEntity";
import { assignmentCollectionName } from "../../src/api/entities/AssignmentEntity";
import { skillTypeCollectionName } from "../../src/api/entities/SkillTypeEntity";
import { getQueryUrlFromParams } from "../../src/api/calls/baseCalls";

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

        await waitFor(() =>
            mockAxios.mockResponseFor(
                { url: projectSkill._links.assignments.href },
                getBaseOkResponse(
                    getBaseLinks(projectSkill._links.assignments.href, assignmentCollectionName, [assignment])
                )
            )
        );

        await waitFor(() =>
            mockAxios.mockResponseFor({ url: assignment._links.student.href }, getBaseOkResponse(student))
        );

        await waitFor(() => expect(screen.getByText(student.callName)).toBeInTheDocument());
    });
});
