import Login from "../src/pages/login";
import LoginForm from "../src/components/loginForm";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { loginSubmitHandler, LoginValues } from "../src/handlers/loginSubmitHandler";
import apiPaths from "../src/properties/apiPaths";
import mockRouter from "next-router-mock";
import applicationPaths from "../src/properties/applicationPaths";
import { ScopedMutator } from "swr/dist/types";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Login page", () => {
    it("should be able to render", () => {
        render(<Login />);

        // Check whether the login form has been rendered in the login page
        const loginForm = screen.getByRole("textbox");
        expect(loginForm).toBeInTheDocument();

        expect(screen.getByTestId("username")).toBeInTheDocument();
        expect(screen.getByTestId("password")).toBeInTheDocument();

        const submitButton = screen.getByTestId("login-submit");
        expect(submitButton).toBeInTheDocument();
    });

    it("Test interface values", () => {
        const values: LoginValues = { username: "test@mail.com", password: "pass" };
        expect(values.username).toEqual("test@mail.com");
        expect(values.password).toEqual("pass");
    });

    test("Test whether the login sends the form", async () => {
        const submitLogin = jest.fn();
        const login = render(<LoginForm submitHandler={submitLogin} />);

        const username = login.getByTestId("username");
        const password = login.getByTestId("password");

        await userEvent.type(username, "test@mail.com");
        await userEvent.type(password, "pass");

        await userEvent.click(login.getByTestId("login-submit"));

        await waitFor(() => {
            expect(submitLogin).toHaveBeenCalledWith(
                { username: "test@mail.com", password: "pass" },
                expect.any(Object)
            );
        });
    });

    it("SubmitHandler for loginForm sends post request", async () => {
        const values: LoginValues = { username: "test@mail.com", password: "pass" };
        const response: AxiosResponse = {
            data: {},
            status: StatusCodes.TEMPORARY_REDIRECT,
            statusText: ReasonPhrases.TEMPORARY_REDIRECT,
            headers: {},
            config: {},
            request: { responseURL: "/home" },
        };

        loginSubmitHandler(values, mockRouter, (() => {}) as any as ScopedMutator);
        mockAxios.mockResponseFor({ url: apiPaths.login }, response);

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.login, expect.anything(), expect.anything());
        });

        await waitFor(() => {
            expect(mockRouter.pathname).toEqual("/" + applicationPaths.home);
        });
    });
});
