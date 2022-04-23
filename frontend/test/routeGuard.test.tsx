import { cleanup, render } from "@testing-library/react";
import RouteGuard from "../src/components/routeGuard";
import Home from "../src/pages/home";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import ApiPaths from "../src/properties/apiPaths";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";
import { AxiosConf } from "../src/api/calls/baseCalls";
import React from "react";
import { jest } from "@jest/globals";
import { getBaseMovedResponse } from "./TestEntityProvider";

afterEach(() => {
    mockAxios.reset();
    cleanup();
});

jest.mock("next/router", () => ({
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

describe("RouteGuard", () => {
    render(
        <RouteGuard>
            <Home />
        </RouteGuard>
    );

    const response: AxiosResponse = getBaseMovedResponse(ApiPaths.base + ApiPaths.loginRedirect);
    mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response);

    it("Should request the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });
});
