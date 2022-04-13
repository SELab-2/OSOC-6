import { ProjectList } from "../src/components/projectList";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import apiPaths from "../src/properties/apiPaths";
import Router from "next/router";
import applicationPaths from "../src/properties/applicationPaths";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("ProjectList header and button", () => {
    it("Should have the 'New project'-button", () => {
        render(<ProjectList />);
        expect(screen.getByTestId("newproject-button")).toBeInTheDocument();
    });

    it("Should have the 'Projects'-header", () => {
        render(<ProjectList />);
        expect(screen.getByTestId("projectlist-header")).toBeInTheDocument();
    });
});

describe("ProjectList initialization", () => {
    it("Should call axios.get() upon rendering", () => {
        render(<ProjectList />);
        expect(mockAxios.get).toHaveBeenCalled();
    });
});

it("Should go to projects/create when clicking button", async () => {
    render(<ProjectList />);
    await userEvent.click(screen.getByTestId("newproject-button"));
    waitFor(() => {
        expect(Router.push).toHaveBeenCalledWith(applicationPaths.projectCreation);
    });
});

it("Should go to project page when clicking item in list", async () => {
    const projectURL = "http://localhost/api/projects/5";

    const response: AxiosResponse = {
        data: {
            _embedded: {
                projects: [
                    {
                        _links: {
                            self: {
                                href: projectURL,
                            },
                        },
                        name: "project name",
                        info: "project info",
                    },
                ],
            },
            page: {
                totalPages: 1,
            },
        },
        status: StatusCodes.TEMPORARY_REDIRECT,
        statusText: ReasonPhrases.TEMPORARY_REDIRECT,
        headers: {},
        config: {},
        request: { responseURL: "/home" },
    };

    render(<ProjectList />);
    mockAxios.mockResponseFor({ method: "GET" }, response);
    await userEvent.click(await screen.findByText("project name"));

    waitFor(() => {
        expect(Router.push).toHaveBeenCalledWith(projectURL.split(apiPaths.base)[1]);
    });
});
