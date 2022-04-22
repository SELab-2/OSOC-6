import { render, screen, waitFor } from "@testing-library/react";
import Home from "../src/pages/home";
import Index from "../src/pages/index";
import RouteGuard from "../src/components/routeGuard";
import MyApp from "../src/pages/_app";
import mockAxios from "jest-mock-axios";
import React from "react";
import useTranslation from "next-translate/useTranslation";
import LoginForm from "../src/components/loginForm";
import mock = jest.mock;
import apiPaths from "../src/properties/apiPaths";
import { AxiosConf } from "../src/api/calls/baseCalls";
import Router from "next/router";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import applicationPaths from "../src/properties/applicationPaths";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Test RouteGuard unauthenticated user to private page", () => {
    render(
            <RouteGuard>
                <Home />
            </RouteGuard>
    );

    it("Rendering a page with the routeguard should get the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });

    it("The user should be redirected when accessing a private page", () => {
        waitFor(() => {
            expect(Router.push).toHaveBeenCalledWith(
                applicationPaths.base + applicationPaths.login
            );
        });
    });
});

describe("Test RouteGuard unauthenticated user to public page", () => {
    render(
        <RouteGuard>
            <Index />
        </RouteGuard>
    );

    const response: AxiosResponse = {
        data: {},
        status: StatusCodes.MOVED_TEMPORARILY,
        statusText: ReasonPhrases.MOVED_TEMPORARILY,
        headers: {},
        config: {},
        request: { responseURL: "/login" },
    };
    mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response);

    it("Rendering a page with the routeguard should get the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });

    it("The user should not be redirected when accessing a public page", () => {
        waitFor(() => {
            expect(Router.push).not.toHaveBeenCalled();
        });
    });
});

describe("Test RouteGuard authenticated user to private page", () => {
    render(
        <RouteGuard>
            <Home />
        </RouteGuard>
    );

    const response: AxiosResponse = {
        data: {
            email: "test@gmail.com",
            callName: "Test User",
            userRole: "COACH",
            username: "test@gmail.com",
        },
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        headers: {},
        config: {},
        request: { responseURL: undefined },
    };
    mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response);

    it("Rendering a page with the routeguard should get the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });

    it("The user should not be redirected when accessing a private page", () => {
        waitFor(() => {
            expect(Router.push).not.toHaveBeenCalled();
        });
    });
});
