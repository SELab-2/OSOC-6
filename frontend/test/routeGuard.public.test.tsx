import {render, waitFor} from "@testing-library/react";
import RouteGuard from "../src/components/routeGuard";
import Index from "../src/pages";
import {AxiosResponse} from "axios";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import ApiPaths from "../src/properties/apiPaths";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";
import {AxiosConf} from "../src/api/calls/baseCalls";
import Router from "next/router";
import React from "react";
import {jest} from "@jest/globals";
import ApplicationPaths from "../src/properties/applicationPaths";

jest.mock('next/router', () => ({
    asPath: "/",
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
        request: { responseURL: ApiPaths.base + ApiPaths.backendLogin },
    };
    mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response);

    it("Rendering a page with the routeguard should get the logged in user", () => {
        expect(mockAxios.get).toHaveBeenCalledWith(apiPaths.ownUser, AxiosConf);
    });

    it("The user should not be redirected when accessing a public page", async () => {
        await waitFor(() => {
            expect(Router.push).not.toHaveBeenCalled();
        });
    });
});