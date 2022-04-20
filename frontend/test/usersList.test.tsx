import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import UsersOverview from "../src/components/usersOverview";
import UserComponent from "../src/components/manageUserComponent";
import { IUser, UserRole } from "../src/api/entities/UserEntity";
import { getBaseUser } from "./TestEntityProvider";

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
            const user: IUser = getBaseUser("2", UserRole.admin);
            render(<UserComponent user={user} />);
            expect(screen.getByTestId("user-row")).toBeInTheDocument();
        });
    });

    describe("Users initialization", () => {
        it("Should call axios.get() upon rendering", async () => {
            render(makeCacheFree(UsersOverview));
            expect(mockAxios.get).toHaveBeenCalled();
        });
    });

    it("User delete", async () => {
        const user: IUser = getBaseUser("2", UserRole.admin);
        render(<UserComponent user={user} />);
        expect(screen.getByTestId("user-row")).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("overview-delete-user"));
        await waitFor(() => {
            expect(mockAxios.delete).toHaveBeenCalled();
        });
    });

    it("User role to coach", async () => {
        const user: IUser = getBaseUser("2", UserRole.admin);
        render(<UserComponent user={user} />);
        expect(screen.getByTestId("user-row")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));
        await userEvent.click(screen.getByTestId("overview-coach-user"));
        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalled();
        });
    });

    it("User role to admin", async () => {
        const user: IUser = getBaseUser("2", UserRole.coach);
        render(<UserComponent user={user} />);
        expect(screen.getByTestId("user-row")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));
        await userEvent.click(screen.getByTestId("overview-admin-user"));
        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalled();
        });
    });

    it("User role to disabled", async () => {
        const user: IUser = getBaseUser("2", UserRole.coach);
        render(<UserComponent user={user} />);
        expect(screen.getByTestId("user-row")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));
        await userEvent.click(screen.getByTestId("overview-disable-user"));
        await waitFor(() => {
            expect(mockAxios.patch).toHaveBeenCalled();
        });
    });
});
