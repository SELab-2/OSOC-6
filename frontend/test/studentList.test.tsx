import { StudentList } from "../src/components/studentList";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import Router from "next/router";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { makeCacheFree } from "./Provide";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("StudentList initialization", () => {
    it("Should call axios.get() upon rendering", () => {
        render(<StudentList />);
        expect(mockAxios.get).toHaveBeenCalled();
    });
});

it("Render studentlist and click an item", async () => {
    const studentURL = "http://localhost/api/users/10";

    const response: AxiosResponse = {
        data: {
            _embedded: {
                students: [
                    {
                        _links: {
                            self: {
                                href: studentURL,
                            },
                        },
                        callName: "test user",
                        bestSkill: "best skill",
                    },
                ],
            },
            page: {
                totalPages: 1,
            },
        },
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        headers: {},
        config: {},
    };

    render(makeCacheFree(StudentList));
    mockAxios.mockResponseFor({ method: "GET" }, response);

    let user: Element = await screen.findByText("test user");
    expect(user).toBeInTheDocument();

    await userEvent.click(user);

    waitFor(() => {
        // expect(Router.push).toHaveBeenCalledWith(studentURL.split(apiPaths.base)[1]);
        expect(Router.push).toHaveBeenCalled();
    });
});
