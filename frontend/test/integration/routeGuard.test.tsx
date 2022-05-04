import { cleanup, render } from "@testing-library/react";
import RouteGuard from "../../src/components/routeGuard";
import Home from "../../src/pages/home";
import { AxiosResponse } from "axios";
import ApiPaths from "../../src/properties/apiPaths";
import apiPaths from "../../src/properties/apiPaths";
import mockAxios from "jest-mock-axios";
import { AxiosConf } from "../../src/api/calls/baseCalls";
import React from "react";
import { jest } from "@jest/globals";
import { getBaseMovedResponse } from "./TestEntityProvider";
import { makeCacheFree } from "./Provide";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

beforeEach(() => {
    mockRouter.asPath = "/home";
});

afterEach(() => {
    mockAxios.reset();
    cleanup();
});

describe("RouteGuard", () => {
    render(
        makeCacheFree(() => (
            <RouteGuard>
                <Home />
            </RouteGuard>
        ))
    );

    const response: AxiosResponse = getBaseMovedResponse(ApiPaths.base + ApiPaths.loginRedirect);
    mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response);

    it("Should request the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });
});
