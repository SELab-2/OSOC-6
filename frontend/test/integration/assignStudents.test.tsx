import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import AssignStudentsPage from "../../src/pages/assignStudents";
import { render, screen } from "@testing-library/react";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Assign Students page", () => {
    it("assign students should be able to render", () => {
        render(<AssignStudentsPage />);

        const navBar = screen.getByRole("navigation");
        expect(navBar).toBeInTheDocument();

        expect(screen.getByTestId("assign-students-grid")).toBeInTheDocument();
        expect(screen.getByTestId("student-list")).toBeInTheDocument();
        expect(screen.getByTestId("project-assignment-list")).toBeInTheDocument();
        expect(screen.getByTestId("student-filter")).toBeInTheDocument();
        expect(screen.getByTestId("conflicts")).toBeInTheDocument();
    });
});
