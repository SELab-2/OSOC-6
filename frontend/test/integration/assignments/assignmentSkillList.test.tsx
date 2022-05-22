import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { act, render, screen, waitFor } from "@testing-library/react";
import AssignmentSkillList from "../../../src/components/projectAssignment/assignmentSkillList";
import { DropHandler } from "../../../src/pages/assignStudents";
import { IProject } from "../../../src/api/entities/ProjectEntity";
import { AxiosResponse } from "axios";
import { getBaseLinks, getBaseOkResponse, getBaseProject, getBaseProjectSkill } from "../TestEntityProvider";
import { IProjectSkill, projectSkillCollectionName } from "../../../src/api/entities/ProjectSkillEntity";
import { capitalize } from "../../../src/utility/stringUtil";
import { enableActForResponse, makeCacheFree } from "../Provide";

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
            makeCacheFree(() => (
                <AssignmentSkillList projectURL={project._links.self.href} dropHandler={drop} />
            ))
        );
    });

    const projectResponse: AxiosResponse = getBaseOkResponse(project);

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    await enableActForResponse({ url: project._links.self.href }, projectResponse);

    const projectSkillsResponse: AxiosResponse = getBaseOkResponse(
        getBaseLinks(project._links.neededSkills.href, projectSkillCollectionName, projectSkills)
    );

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    await enableActForResponse({ url: project._links.neededSkills.href }, projectSkillsResponse);
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

    it("Add a second skill and test sort", async () => {
        const project = getBaseProject("1");
        const projectSkill = getBaseProjectSkill("2");
        const projectSkill2 = getBaseProjectSkill("3");
        projectSkill2.name = "Second project that should be first";
        const projectSkill3 = getBaseProjectSkill("4");
        projectSkill3.name = "Second project that should be first";
        const projectSkill4 = getBaseProjectSkill("4");
        projectSkill4.name = "Another one but this one should be first";
        await renderSkillList(project, [projectSkill4, projectSkill, projectSkill2, projectSkill3]);

        await waitFor(() => {
            const html = document.body.innerHTML;
            const a = html.search(projectSkill2.name);
            const b = html.search(projectSkill.name);
            expect(screen.getByTestId("assignment-skill-list")).toBeInTheDocument();
            expect(a).toBeLessThan(b);
        });
    });
});
