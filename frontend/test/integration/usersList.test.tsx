import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { act, render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import UsersOverview from "../../src/components/user/usersOverview";
import UserComponent from "../../src/components/user/manageUserComponent";
import { IUser, UserRole } from "../../src/api/entities/UserEntity";
import {
    getBaseBadRequestResponse,
    getBaseNoContentResponse,
    getBaseOkResponse,
    getBaseUser,
} from "./TestEntityProvider";
import { AxiosResponse } from "axios";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Users", () => {
    describe("Users overview and rows", () => {
        it("Should have overview component", () => {
            render(makeCacheFree(UsersOverview));
            expect(screen.getByTestId("user-overview")).toBeInTheDocument();
        });

        it("Should have rows for the users", () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            act(() => {
                render(<UserComponent key={user.email} user={user} />);
            });
            expect(screen.getByTestId("user-row")).toBeInTheDocument();
        });

        it("should render full userOverview component", () => {
            render(makeCacheFree(UsersOverview));
            expect(screen.getByTestId("user-overview")).toBeInTheDocument();
        });
    });

    describe("Users initialization", () => {
        it("Should call axios.get() upon rendering", async () => {
            render(makeCacheFree(UsersOverview));
            expect(mockAxios.get).toHaveBeenCalled();
        });
    });

    describe("User Updates/Delete", () => {
        it("User role to admin", async () => {
            const user: IUser = getBaseUser("2", UserRole.coach, true);
            act(() => {
                render(<UserComponent key={user.email} user={user} />);
            });

            await act(async () => await userEvent.click(screen.getByRole("button")));
            await act(async () => await userEvent.click(screen.getByTestId("overview-admin-user")));

            await waitFor(() => {
                expect(mockAxios.patch).toHaveBeenCalled();
            });

            const new_user: IUser = getBaseUser("2", UserRole.admin, true);
            const response: AxiosResponse = getBaseOkResponse(new_user);
            act(() => mockAxios.mockResponseFor({ url: user._links.self.href }, response));
        });

        it("User role to disabled", async () => {
            const user: IUser = getBaseUser("2", UserRole.coach, true);
            act(() => {
                render(<UserComponent key={user.email} user={user} />);
            });

            await act(async () => await userEvent.click(screen.getByRole("button")));
            await act(async () => await userEvent.click(screen.getByTestId("overview-disable-user")));

            await waitFor(() => expect(mockAxios.patch).toHaveBeenCalled());

            const new_user: IUser = getBaseUser("2", UserRole.coach, false);
            const response: AxiosResponse = getBaseOkResponse(new_user);
            act(() => mockAxios.mockResponseFor({ url: user._links.self.href }, response));
        });

        it("User delete", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            window.confirm = jest.fn(() => true);

            await userEvent.click(screen.getByTestId("overview-delete-user"));
            await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled());

            const response: AxiosResponse = getBaseNoContentResponse();
            act(() => mockAxios.mockResponseFor({ url: user._links.self.href }, response));
        });

        it("User role to coach", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            await userEvent.click(screen.getByRole("button"));
            await userEvent.click(screen.getByTestId("overview-coach-user"));
            await waitFor(() => expect(mockAxios.patch).toHaveBeenCalled());

            const new_user: IUser = getBaseUser("2", UserRole.coach, true);
            const response: AxiosResponse = getBaseOkResponse(new_user);
            act(() => mockAxios.mockResponseFor({ url: user._links.self.href }, response));
        });

        it("Failed patch", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            await userEvent.click(screen.getByRole("button"));
            await userEvent.click(screen.getByTestId("overview-coach-user"));
            await waitFor(() => expect(mockAxios.patch).toHaveBeenCalled());

            const response: AxiosResponse = getBaseBadRequestResponse();
            act(() => mockAxios.mockResponseFor({ url: user._links.self.href }, response));
        });

        it("delete fail", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            window.confirm = jest.fn(() => true);

            await userEvent.click(screen.getByTestId("overview-delete-user"));
            await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled());

            const response: AxiosResponse = getBaseBadRequestResponse();
            act(() => mockAxios.mockResponseFor({ url: user._links.self.href }, response));
        });
    });
});
