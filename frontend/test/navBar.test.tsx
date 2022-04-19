import { render, screen, waitFor } from "@testing-library/react";
import NavBar from "../src/components/navBar";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import applicationPaths from "../src/properties/applicationPaths";
import mockRouter from "next-router-mock";

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
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-brand"));
    expect(mockRouter.pathname).toEqual(applicationPaths.students);
});

it("Click users", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-users"));
    expect(mockRouter.pathname).toEqual(applicationPaths.users);
});

it("Click students", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-students"));
    expect(mockRouter.pathname).toEqual(applicationPaths.students);
});

it("Click assign students", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-assignstudents"));
    expect(mockRouter.pathname).toEqual(applicationPaths.assignStudents);
});

it("Click projects", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-projects"));
    expect(mockRouter.pathname).toEqual(applicationPaths.projects);
});

it("Click profile", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-profile"));
    expect(mockRouter.pathname).toEqual(applicationPaths.profile);
});
