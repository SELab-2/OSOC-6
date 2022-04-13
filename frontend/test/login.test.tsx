import Login from "../src/pages/login";
import LoginForm from "../src/components/loginForm";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import Router from "next/router";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { loginSubmitHandler, LoginValues } from "../src/handlers/loginSubmitHandler";
import apiPaths from "../src/properties/apiPaths";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Login page", () => {
    it("should be able to render", async () => {
        render(<Login />);

        // Check whether the login form has been rendered in the login page
        const loginForm = screen.getByRole("textbox");
        expect(loginForm).toBeInTheDocument();

        expect(screen.getByTestId("username")).toBeInTheDocument();
        expect(screen.getByTestId("password")).toBeInTheDocument();

        const submitButton = screen.getByRole("button");
        expect(submitButton).toBeInTheDocument();
    });
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

    await userEvent.click(login.getByRole("button"));

    await waitFor(() => {
        expect(submitLogin).toHaveBeenCalledWith(
            { username: "test@mail.com", password: "pass" },
            expect.any(Object)
        );
    });
});

it("SubmitHandler for loginForm sends post request", () => {
    const values: LoginValues = { username: "test@mail.com", password: "pass" };
    const response: AxiosResponse = {
        data: {},
        status: StatusCodes.TEMPORARY_REDIRECT,
        statusText: ReasonPhrases.TEMPORARY_REDIRECT,
        headers: {},
        config: {},
        request: { responseURL: "/home" },
    };

    loginSubmitHandler(values);
    mockAxios.mockResponseFor({ url: apiPaths.login }, response);

    waitFor(() => {
        expect(mockAxios.post).toHaveBeenCalledWith(apiPaths.login);
        expect(Router.push).toHaveBeenCalled();
    });
});
