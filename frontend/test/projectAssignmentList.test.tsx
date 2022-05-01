import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { act, render, screen, waitFor } from "@testing-library/react";
import ProjectAsignmentList from "../src/components/project_assignment/projectAssignmentList";
import { getBaseOkResponse, getBasePage, getBaseProject, getBaseStudent } from "./TestEntityProvider";
import apiPaths from "../src/properties/apiPaths";
import { AxiosResponse } from "axios";

jest.mock("next/router", () => require("next-router-mock"));

type SkillInfo = { skillName: string; skillColor: string; skillUrl: string };

afterEach(() => {
    mockAxios.reset();
});

describe("Project assignment list", () => {
    it("It should render", async () => {
        function drop(studentName: string, studentUrl: string, skillInfo: SkillInfo, projectName: string) {}

        let student = getBaseStudent("1");
        student.yesSuggestionCount = 5;
        student.maybeSuggestionCount = 3;
        student.noSuggestionCount = 1;

        const baseProject = getBaseProject("5");
        const response: AxiosResponse = getBaseOkResponse(
            getBasePage(apiPaths.projects, "projects", [baseProject])
        );

        render(<ProjectAsignmentList dropHandler={drop} />);

        await waitFor(() => {
            expect(mockAxios.get).toHaveBeenCalled();
        });

        act(() => mockAxios.mockResponseFor({ method: "GET" }, response));

        await waitFor(() => {
            expect(screen.getByText(baseProject.name)).toBeInTheDocument();
        });

        console.log("screen: " + screen.debug());
    });
});
