import { StudentList } from "../src/components/studentList";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import Router from "next/router";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { makeCacheFree } from "./Provide";
import {getBaseOkResponse, getBasePage, getBaseStudent} from "./TestEntityProvider";
import apiPaths from "../src/properties/apiPaths";

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
    const id = "10";
    const student = getBaseStudent(id)

    const response: AxiosResponse = getBaseOkResponse(
        getBasePage(apiPaths.students, "students", [student])
    );

    render(makeCacheFree(StudentList));
    mockAxios.mockResponseFor({ method: "GET" }, response);

    let studentElement = await screen.findByText(student.callName);
    expect(studentElement).toBeInTheDocument();

    await userEvent.click(studentElement);

    waitFor(() => {
        expect(Router.push).toHaveBeenCalled();
    });
});
