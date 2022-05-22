import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { render, waitFor } from "@testing-library/react";
import EditProjectPage from "../../../src/pages/projects/[id]/edit";
import { getBaseOkResponse, getBaseProject, getBaseTeapot } from "../TestEntityProvider";
import { enableActForResponse, makeCacheFree } from "../Provide";
import mockRouter from "next-router-mock";
import apiPaths from "../../../src/properties/apiPaths";
import EditionPage from "../../../src/pages/editions";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Edit project Page", () => {
    const projectId = "1";
    const project = getBaseProject(projectId);
    beforeEach(() => {
        mockRouter.query = { id: projectId };
    });

    describe("without data", () => {
        it("renders", async () => {
            const page = render(<EditProjectPage />);

            await page.findByTestId("edit-project-page");
        });
    });

    describe("with data", () => {
        it("renders", async () => {
            const page = render(makeCacheFree(EditProjectPage));

            await enableActForResponse(apiPaths.projects + "/" + projectId, getBaseOkResponse(project));

            await page.findByTestId("edit-project-page");
            await page.findByDisplayValue(project.name);
        });
    });

    it("Should handle error", async () => {
        console.log = jest.fn();

        render(makeCacheFree(EditProjectPage));
        await enableActForResponse(apiPaths.projects + "/" + projectId, getBaseTeapot());

        await waitFor(() => expect(console.log).toHaveBeenCalled());
    });
});
