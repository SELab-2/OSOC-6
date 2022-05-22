import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import {enableActForResponse, makeCacheFree} from "./Provide";
import ChangeEmail from "../../src/pages/changeEmail";
import ChangePassword from "../../src/pages/changePassword";
import { getBaseOkResponse, getBaseUser } from "./TestEntityProvider";
import { IUser, UserRole } from "../../src/api/entities/UserEntity";
import { AxiosResponse } from "axios";
import apiPaths from "../../src/properties/apiPaths";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

async function renderNormalUser(toRender: Function, user: IUser) {
    render(makeCacheFree(toRender));

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    const response: AxiosResponse = getBaseOkResponse(user);
    await enableActForResponse({ url: apiPaths.ownUser }, response);
}

async function performPatch(string1: string, string2: string, toRender: Function, user: IUser) {
    await renderNormalUser(toRender, user);

    const input1 = screen.getByTestId("reset-input-1");
    expect(input1).toBeInTheDocument();
    await userEvent.type(input1, string1);

    const input2 = screen.getByTestId("reset-input-2");
    expect(input2).toBeInTheDocument();
    await userEvent.type(input2, string2);
    await act(async () => await userEvent.click(screen.getByTestId("confirm-reset")));

    await waitFor(() => {
        expect(mockAxios.patch).toHaveBeenCalledWith(
            user._links.self.href,
            expect.anything(),
            expect.anything()
        );
    });
}

describe("Reset Component Tests", () => {
    it("changeEmail should show reset component", () => {
        render(makeCacheFree(ChangeEmail));
        expect(screen.getByTestId("reset-component")).toBeInTheDocument();
    });

    it("changePassword should show reset component", () => {
        render(makeCacheFree(ChangePassword));
        expect(screen.getByTestId("reset-component")).toBeInTheDocument();
    });

    it("changeEmail patch", async () => {
        const user = getBaseUser("2", UserRole.admin, true);
        const newMail: string = "new@mail.com";
        await performPatch(newMail, newMail, ChangeEmail, user);

        // May be empty, we don't process the returned values
        const response: AxiosResponse = getBaseOkResponse({});
        await enableActForResponse({ method: "PATCH" }, response);
    });

    it("changeEmail patch fail", async () => {
        const user = getBaseUser("2", UserRole.admin, true);
        const newMail: string = "new@mail.com";
        const newMail2: string = "ne@mail.com";
        await renderNormalUser(ChangeEmail, user);

        const input1 = screen.getByTestId("reset-input-1");
        expect(input1).toBeInTheDocument();
        await userEvent.type(input1, newMail);

        const input2 = screen.getByTestId("reset-input-2");
        expect(input2).toBeInTheDocument();
        await userEvent.type(input2, newMail2);
        await act(async () => await userEvent.click(screen.getByTestId("confirm-reset")));
        act(() => expect(screen.getByTestId("toast-reset")).toBeInTheDocument());
    });

    it("changePassword patch", async () => {
        const user = getBaseUser("2", UserRole.admin, true);
        const newPassword: string = "new-secure-password";
        await performPatch(newPassword, newPassword, ChangePassword, user);

        // May be empty, we don't process the returned values
        const response: AxiosResponse = getBaseOkResponse({});
        await enableActForResponse({ method: "PATCH" }, response)
    });

    it("changePassword patch fail", async () => {
        const user = getBaseUser("2", UserRole.admin, true);
        const newPassword: string = "new-secure-password";
        const newPassword2: string = "new-secure-passwod";
        await renderNormalUser(ChangePassword, user);

        const input1 = screen.getByTestId("reset-input-1");
        expect(input1).toBeInTheDocument();
        await userEvent.type(input1, newPassword);

        const input2 = screen.getByTestId("reset-input-2");
        expect(input2).toBeInTheDocument();
        await userEvent.type(input2, newPassword2);
        await act(async () => await userEvent.click(screen.getByTestId("confirm-reset")));
        act(() => expect(screen.getByTestId("toast-reset")).toBeInTheDocument());
    });
});
