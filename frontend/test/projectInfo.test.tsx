import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import { ProjectInfo } from "../src/components/projectInfo";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";
import mockRouter from "next-router-mock";
import {
    getBaseAdmin,
    getBaseAssignment,
    getBaseLinks,
    getBaseOkResponse,
    getBasePage,
    getBaseProject,
    getBaseProjectSkill,
    getBaseSkillType,
    getBaseStudent,
} from "./TestEntityProvider";
import { userCollectionName } from "../src/api/entities/UserEntity";
import { projectSkillCollectionName } from "../src/api/entities/ProjectSkillEntity";
import { assignmentCollectionName } from "../src/api/entities/AssignmentEntity";
import { skillTypeCollectionName } from "../src/api/entities/SkillTypeEntity";

jest.mock("next/router", () => require("next-router-mock"));

describe("project info", () => {
    it("should render without data", () => {
        render(makeCacheFree(ProjectInfo));
    });

    it("should render with data", async () => {
        mockRouter.setCurrentUrl("/projects/5");
        mockRouter.query = { id: "5" };
        render(makeCacheFree(ProjectInfo));

        const project = getBaseProject("5");
        await waitFor(() =>
            mockAxios.mockResponseFor({ url: apiPaths.projects + "/5" }, getBaseOkResponse(project))
        );

        const user = getBaseAdmin("6");
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { url: project._links.coaches.href },
                getBaseOkResponse(getBaseLinks(project._links.coaches.href, userCollectionName, [user]))
            )
        );

        const projectSkill = getBaseProjectSkill("7");
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { url: project._links.neededSkills.href },
                getBaseOkResponse(
                    getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, [projectSkill])
                )
            )
        );

        const skillType = getBaseSkillType("8");
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { url: apiPaths.skillTypesByName },
                getBaseOkResponse(
                    getBasePage(apiPaths.skillTypesByName, skillTypeCollectionName, [skillType])
                )
            )
        );

        const assignment = getBaseAssignment("9");
        await waitFor(() =>
            mockAxios.mockResponseFor(
                { url: projectSkill._links.assignments.href },
                getBaseOkResponse(
                    getBaseLinks(projectSkill._links.assignments.href, assignmentCollectionName, [assignment])
                )
            )
        );

        const student = getBaseStudent("10");
        await waitFor(() =>
            mockAxios.mockResponseFor({ url: assignment._links.student.href }, getBaseOkResponse(student))
        );

        await waitFor(() => expect(screen.getByText(student.callName)).toBeInTheDocument());
    });
});
