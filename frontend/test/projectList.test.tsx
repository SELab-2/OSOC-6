import { ProjectList } from "../src/components/projectList";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";
import applicationPaths from "../src/properties/applicationPaths";
import { AxiosResponse } from "axios";
import { getBaseOkResponse, getBasePage, getBaseProject } from "./TestEntityProvider";
import mockRouter from "next-router-mock";
import { makeCacheFree } from "./Provide";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Project", () => {
    describe("ProjectList header and button", () => {
        it("Should have the 'New project'-button", () => {
            render(makeCacheFree(ProjectList));
            expect(screen.getByTestId("newproject-button")).toBeInTheDocument();
        });

        it("Should have the 'Projects'-header", () => {
            render(makeCacheFree(ProjectList));
            expect(screen.getByTestId("projectlist-header")).toBeInTheDocument();
        });
    });

    describe("ProjectList initialization", () => {
        it("Should call axios.get() upon rendering", async () => {
            render(makeCacheFree(ProjectList));
            expect(mockAxios.get).toHaveBeenCalled();
        });
    });

    it("Should go to projects/create when clicking button", async () => {
        render(<ProjectList/>);
        await userEvent.click(screen.getByTestId("newproject-button"));
        await waitFor(() => {
            expect(mockRouter.pathname).toEqual(applicationPaths.projectCreation);
        });
    });

    it("Should go to project page when clicking item in list", async () => {
        const baseProject = getBaseProject("5");
        const response: AxiosResponse = getBaseOkResponse(
            getBasePage(apiPaths.projects, "projects", [baseProject])
        );

        render(makeCacheFree(ProjectList));

        mockAxios.mockResponseFor({ method: "GET" }, response);
        await userEvent.click(await screen.findByText(baseProject.name));

        expect(mockRouter.pathname).toEqual("projects/5");
    });
})

