import { render, screen } from "@testing-library/react";
import NavBar from "../../src/components/util/navBar";
import "@testing-library/jest-dom";
import applicationPaths from "../../src/properties/applicationPaths";
import { makeCacheFree } from "./Provide";

describe("Navbar Tests", () => {
    it("Should be able to render.", async () => {
        render(<NavBar />);

        expect(screen.getByTestId("navbar-brand")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-students")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-users")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-projects")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-assignstudents")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-profile")).toBeInTheDocument();
    });

    it("Click brand", async () => {
        render(makeCacheFree(() => <NavBar />));
        expect(screen.getByTestId("navbar-brand")).toHaveAttribute(
            "href",
            "/" + applicationPaths.assignStudents
        );
    });

    it("Click users", async () => {
        render(makeCacheFree(() => <NavBar />));
        expect(screen.getByTestId("navbar-users")).toHaveAttribute("href", "/" + applicationPaths.users);
    });

    it("Click students", async () => {
        render(makeCacheFree(() => <NavBar />));
        expect(screen.getByTestId("navbar-students")).toHaveAttribute(
            "href",
            "/" + applicationPaths.students
        );
    });

    it("Click assign students", async () => {
        render(makeCacheFree(() => <NavBar />));
        expect(screen.getByTestId("navbar-assignstudents")).toHaveAttribute(
            "href",
            "/" + applicationPaths.assignStudents
        );
    });

    it("Click projects", async () => {
        render(makeCacheFree(() => <NavBar />));
        expect(screen.getByTestId("navbar-projects")).toHaveAttribute(
            "href",
            "/" + applicationPaths.projects
        );
    });
});
