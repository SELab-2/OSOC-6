import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { act, render, screen, waitFor } from "@testing-library/react";
import ProjectAsignmentList from "../src/components/project_assignment/projectAssignmentList";
import { getBaseOkResponse, getBasePage, getBaseProject } from "./TestEntityProvider";
import apiPaths from "../src/properties/apiPaths";
import { AxiosResponse } from "axios";
import { capitalize } from "../src/utility/stringUtil";
import { IProject } from "../src/api/entities/ProjectEntity";
import { makeCacheFree } from "./Provide";
import { DropHandler } from "../src/pages/assignStudents";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

async function renderAssignProject(projectList: IProject[]) {
    const response: AxiosResponse = getBaseOkResponse(
        getBasePage(apiPaths.projects, "projects", projectList)
    );
    const drop: DropHandler = () => {};
    render(makeCacheFree(() => ProjectAsignmentList({ dropHandler: drop })));

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    act(() => mockAxios.mockResponseFor({ method: "GET" }, response));
}

describe("Project assignment list", () => {
    it("It should render", async () => {
        const baseProject = getBaseProject("5");
        await renderAssignProject([baseProject]);

        await waitFor(() => {
            expect(screen.getByText(baseProject.name)).toBeInTheDocument();
        });
    });

    it("Test no projects", async () => {
        await renderAssignProject([]);

        await waitFor(() => {
            expect(screen.getByText(capitalize("no projects"))).toBeInTheDocument();
        });
    });
});
