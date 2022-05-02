import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { act, createEvent, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import AssignmentSkillList from "../src/components/project_assignment/assignmentSkillList";
import { DropHandler } from "../src/pages/assignStudents";
import { IProject } from "../src/api/entities/ProjectEntity";
import { AxiosResponse } from "axios";
import { getBaseLinks, getBaseOkResponse, getBaseProject, getBaseProjectSkill } from "./TestEntityProvider";
import { IProjectSkill, projectSkillCollectionName } from "../src/api/entities/ProjectSkillEntity";
import { capitalize } from "../src/utility/stringUtil";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

async function renderSkillList(project: IProject, projectSkills: IProjectSkill[]) {
    const drop: DropHandler = () => {
        console.log("dropped");
    };

    await act(() => {
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <AssignmentSkillList project={project} dropHandler={drop} />
            </SWRConfig>
        );
    });

    const projectSkillsResponse: AxiosResponse = getBaseOkResponse(
        getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, projectSkills)
    );

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    await act(() =>
        mockAxios.mockResponseFor({ url: project._links.neededSkills.href }, projectSkillsResponse)
    );
}

describe("Assignment skill list tests", () => {
    it("Should render with a project skill", async () => {
        const project = getBaseProject("1");
        const projectSkill = getBaseProjectSkill("2");
        await renderSkillList(project, [projectSkill]);

        await waitFor(() => {
            expect(screen.getByTestId("assignment-skill-list")).toBeInTheDocument();
            expect(screen.getByTestId("assignment-item")).toBeInTheDocument();
        });
    });

    it("Should render without a project skill", async () => {
        const project = getBaseProject("1");
        await renderSkillList(project, []);

        await waitFor(() => {
            expect(screen.getByTestId("assignment-skill-list")).toBeInTheDocument();
            expect(screen.getByText(capitalize("no skills for project"))).toBeInTheDocument();
        });
    });

    it("Add a second skill", async () => {
        const project = getBaseProject("1");
        const projectSkill = getBaseProjectSkill("2");
        await renderSkillList(project, [projectSkill]);

        await waitFor(() => {
            expect(screen.getByTestId("assignment-skill-list")).toBeInTheDocument();
        });
    });
});
