import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { render, screen } from "@testing-library/react";
import ProjectPage from "../../src/pages/projects";
import ProjectIDPage from "../../src/pages/projects/[id]";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Projects Page Tests", () => {
    it("projects page should be able to render", () => {
        render(<ProjectPage />);

        const navBar = screen.getByRole("navigation");
        expect(navBar).toBeInTheDocument();

        expect(screen.getByTestId("projects-grid")).toBeInTheDocument();

        expect(screen.getByTestId("project-list")).toBeInTheDocument();

        expect(screen.getByTestId("projects-select-message")).toBeInTheDocument();
    });

    it("projects/[id] should be able to render", () => {
        render(<ProjectIDPage />);

        const navBar = screen.getByRole("navigation");
        expect(navBar).toBeInTheDocument();

        expect(screen.getByTestId("projects-grid")).toBeInTheDocument();

        expect(screen.getByTestId("project-list")).toBeInTheDocument();
        /*
        expect(screen.getByTestId("project-info")).toBeInTheDocument();
        */
    });
});
