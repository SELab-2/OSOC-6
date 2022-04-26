import mockAxios from "jest-mock-axios";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Registration from "../src/pages/registration";
import { makeCacheFree } from "./Provide";
import { User } from "../src/api/entities/UserEntity";
import apiPaths from "../src/properties/apiPaths";
import { AxiosConf } from "../src/api/calls/baseCalls";
import { getBaseForbiddenResponse } from "./TestEntityProvider";
import { act } from "react-dom/test-utils";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

async function performRegistration(callname: string, email: string, password: string, repeat: string) {
    const registration = await render(makeCacheFree(Registration));

    expect(screen.getByTestId("register-button")).toBeInTheDocument();

    const callnameInput = registration.getByTestId("callname");
    expect(callnameInput).toBeInTheDocument();
    await userEvent.type(callnameInput, callname);

    const emailInput = registration.getByTestId("email");
    expect(emailInput).toBeInTheDocument();
    await userEvent.type(emailInput, email);

    const passwordInput = registration.getByTestId("password");
    expect(passwordInput).toBeInTheDocument();
    await userEvent.type(passwordInput, password);

    const repeatInput = registration.getByTestId("repeat");
    expect(repeatInput).toBeInTheDocument();
    await userEvent.type(repeatInput, repeat);
}

describe("Registration", () => {
    const user = new User("Callname", "callname@test.com", "pass");
    it("should render a registration form.", async () => {
        await performRegistration(user.callName, user.email, user.password, user.password);
    });

    it("submit should post the registration", async () => {
        await performRegistration(user.callName, user.email, user.password, user.password);
        await userEvent.click(screen.getByTestId("register-button"));
        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.base + apiPaths.registration, user, {
                ...AxiosConf,
                params: { token: undefined },
            });
        });
    });

    it("failed submit should show error", async () => {
        const response = getBaseForbiddenResponse();
        mockAxios.post.mockRejectedValueOnce(response);
        await performRegistration(user.callName, user.email, user.password, user.password);
        await act(async () => userEvent.click(screen.getByTestId("register-button")));
        expect(screen.getByTestId("toast-registration")).toBeVisible();
    });

    it("different passwords should show error", async () => {
        await performRegistration(user.callName, user.email, user.password, "not pass");
        await act(async () => userEvent.click(screen.getByTestId("register-button")));
        expect(screen.getByTestId("toast-registration")).toBeVisible();
    });
});
