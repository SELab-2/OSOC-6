import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { act, render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import UsersOverview from "../src/components/usersOverview";
import UserComponent from "../src/components/manageUserComponent";
import { IUser, UserRole } from "../src/api/entities/UserEntity";
import { getBaseUser } from "./TestEntityProvider";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

function mockRequestOK(url: string, new_user: IUser) {
    const response: AxiosResponse = {
        data: new_user,
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        headers: {},
        config: {},
        request: {},
    };
    act(() => mockAxios.mockResponseFor({ url: url }, response));
}

function mockRequestFAIL(url: string) {
    const response: AxiosResponse = {
        data: {},
        status: StatusCodes.BAD_REQUEST,
        statusText: ReasonPhrases.BAD_REQUEST,
        headers: {},
        config: {},
        request: {},
    };
    act(() => mockAxios.mockResponseFor({ url: url }, response));
}

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

        it("Users page", () => {
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

            await act(async () => {
                await userEvent.click(screen.getByRole("button"));
            });
            await act(async () => {
                await userEvent.click(screen.getByTestId("overview-admin-user"));
            });

            await waitFor(() => {
                expect(mockAxios.patch).toHaveBeenCalled();
            });

            const new_user: IUser = getBaseUser("2", UserRole.admin, true);
            mockRequestOK(user._links.self.href, new_user);
        });

        it("User role to disabled", async () => {
            const user: IUser = getBaseUser("2", UserRole.coach, true);
            act(() => {
                render(<UserComponent key={user.email} user={user} />);
            });

            await act(async () => await userEvent.click(screen.getByRole("button")));
            await act(async () => {
                await userEvent.click(screen.getByTestId("overview-disable-user"));
            });

            await waitFor(() => {
                expect(mockAxios.patch).toHaveBeenCalled();
            });

            const new_user: IUser = getBaseUser("2", UserRole.coach, false);
            mockRequestOK(user._links.self.href, new_user);
        });

        it("User delete", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            await userEvent.click(screen.getByTestId("overview-delete-user"));
            await waitFor(() => {
                expect(mockAxios.delete).toHaveBeenCalled();
            });

            const response: AxiosResponse = {
                data: {},
                status: StatusCodes.NO_CONTENT,
                statusText: ReasonPhrases.NO_CONTENT,
                headers: {},
                config: {},
                request: {},
            };
            act(() => mockAxios.mockResponseFor({ url: user._links.self.href }, response));
        });

        it("User role to coach", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            await userEvent.click(screen.getByRole("button"));
            await userEvent.click(screen.getByTestId("overview-coach-user"));
            await waitFor(() => {
                expect(mockAxios.patch).toHaveBeenCalled();
            });

            const new_user: IUser = getBaseUser("2", UserRole.coach, true);
            mockRequestOK(user._links.self.href, new_user);
        });

        it("Failed patch", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            await userEvent.click(screen.getByRole("button"));
            await userEvent.click(screen.getByTestId("overview-coach-user"));
            await waitFor(() => {
                expect(mockAxios.patch).toHaveBeenCalled();
            });

            mockRequestFAIL(user._links.self.href);
        });

        it("delete fail", async () => {
            const user: IUser = getBaseUser("2", UserRole.admin, true);
            render(<UserComponent key={user.email} user={user} />);

            await userEvent.click(screen.getByTestId("overview-delete-user"));
            await waitFor(() => {
                expect(mockAxios.delete).toHaveBeenCalled();
            });

            mockRequestFAIL(user._links.self.href);
        });
    });
});
