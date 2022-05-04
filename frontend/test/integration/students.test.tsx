import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { render, screen } from "@testing-library/react";
import StudentsPage from "../../src/pages/students";
import StudentsIDPage from "../../src/pages/students/[id]";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Students1 Page Tests", () => {
    it("students page should be able to render", () => {
        render(<StudentsPage />);

        const navBar = screen.getByRole("navigation");
        expect(navBar).toBeInTheDocument();

        expect(screen.getByTestId("students-grid")).toBeInTheDocument();
        expect(screen.getByTestId("student-list")).toBeInTheDocument();
        expect(screen.getByTestId("student-filter")).toBeInTheDocument();
        expect(screen.getByTestId("student-select-message")).toBeInTheDocument();
    });

    it("students/[id] should be able to render", () => {
        render(<StudentsIDPage />);

        const navBar = screen.getByRole("navigation");
        expect(navBar).toBeInTheDocument();

        expect(screen.getByTestId("students-grid")).toBeInTheDocument();
        expect(screen.getByTestId("student-list")).toBeInTheDocument();
        expect(screen.getByTestId("student-filter")).toBeInTheDocument();
        expect(screen.getByTestId("student-info")).toBeInTheDocument();
    });
});
