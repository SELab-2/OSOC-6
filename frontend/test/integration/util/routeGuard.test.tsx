import { cleanup, render } from "@testing-library/react";
import { AxiosResponse } from "axios";
import React from "react";
import { jest } from "@jest/globals";
import mockRouter from "next-router-mock";
import mockAxios from "jest-mock-axios";
import {enableActForResponse, makeCacheFree} from "../Provide";
import RouteGuard from "../../../src/components/util/routeGuard";
import AssignStudents from "../../../src/pages/assignStudents";
import { getBaseMovedResponse } from "../TestEntityProvider";
import ApiPaths from "../../../src/properties/apiPaths";
import apiPaths from "../../../src/properties/apiPaths";
import { AxiosConf } from "../../../src/api/calls/baseCalls";

jest.mock("next/router", () => require("next-router-mock"));

beforeEach(() => {
    mockRouter.asPath = "/home";
});

afterEach(() => {
    mockAxios.reset();
    cleanup();
});

describe("RouteGuard", () => {
    beforeEach(async () => {
        render(
            makeCacheFree(() => (
                <RouteGuard>
                    <AssignStudents />
                </RouteGuard>
            ))
        );

        const response: AxiosResponse = getBaseMovedResponse(ApiPaths.base + ApiPaths.loginRedirect);
        await enableActForResponse({ url: apiPaths.ownUser }, response);
    });

    it("Should request the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });
});
