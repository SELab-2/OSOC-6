import { act, render, screen, waitFor } from "@testing-library/react";
import NavBar from "../../../src/components/util/navBar";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import applicationPaths from "../../../src/properties/applicationPaths";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import { getBaseOkResponse, getBaseUser } from "../TestEntityProvider";
import { UserRole } from "../../../src/api/entities/UserEntity";
import apiPaths from "../../../src/properties/apiPaths";

it("Should be able to render.", async () => {
    render(<NavBar />);

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
    const responseUser: AxiosResponse = getBaseOkResponse(getBaseUser("5", UserRole.admin, true));
    act(() => mockAxios.mockResponseFor({ url: apiPaths.ownUser }, responseUser));

    await waitFor(() => {
        expect(screen.getByTestId("navbar-brand")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-students")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-users")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-projects")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-assignstudents")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-profile")).toBeInTheDocument();
    });
});

it.skip("Click brand", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-brand"));
    await waitFor(() => {
        expect(mockRouter.pathname).toEqual("/" + applicationPaths.students);
    });
});

it.skip("Click users", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-users"));
    await waitFor(() => {
        expect(mockRouter.pathname).toEqual("/" + applicationPaths.users);
    });
});

it.skip("Click students", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-students"));
    expect(mockRouter.pathname).toEqual("/" + applicationPaths.students);
});

it.skip("Click assign students", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-assignstudents"));
    await waitFor(() => {
        expect(mockRouter.pathname).toEqual("/" + applicationPaths.assignStudents);
    });
});

it.skip("Click projects", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-projects"));
    await waitFor(() => {
        expect(mockRouter.pathname).toEqual("/" + applicationPaths.projects);
    });
});

it.skip("Click profile", async () => {
    render(<NavBar />);

    await userEvent.click(screen.getByTestId("navbar-profile"));
    await waitFor(() => {
        expect(mockRouter.pathname).toEqual("/" + applicationPaths.profile);
    });
});
