import {act, cleanup, render, screen, waitFor} from "@testing-library/react";
import Home from "../src/pages/home";
import Index from "../src/pages/index";
import RouteGuard from "../src/components/routeGuard";
import mockAxios from "jest-mock-axios";
import React from "react";
import apiPaths from "../src/properties/apiPaths";
import { AxiosConf } from "../src/api/calls/baseCalls";
import Router, {useRouter} from "next/router";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {jest} from "@jest/globals";
import ApiPaths from "../src/properties/apiPaths";

afterEach(() => {
    mockAxios.reset();
    cleanup();
});

jest.mock('next/router', () => ({
    asPath: "/home",
    push: jest.fn(),
    back: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
    },
    beforePopState: jest.fn(() => null),
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe("Test RouteGuard unauthenticated user to private page", () => {
    render(
        <RouteGuard>
            <Home />
        </RouteGuard>
    );

    const response: AxiosResponse = {
        data: {},
        status: StatusCodes.MOVED_TEMPORARILY,
        statusText: ReasonPhrases.MOVED_TEMPORARILY,
        headers: {},
        config: {},
        request: { responseURL: ApiPaths.base + ApiPaths.backendLogin },
    };
    mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response);

    it("Rendering a page with the routeguard should get the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });

    it("The user should be redirected when accessing a private page", () => {
        expect(Router.push).toHaveBeenCalled();
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
            expect(useRouter().push).not.toHaveBeenCalled();
        });
    });
});
