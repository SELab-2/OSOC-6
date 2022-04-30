import { StudentList } from "../src/components/studentList";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import { makeCacheFree } from "./Provide";
import { getBaseOkResponse, getBasePage, getBaseStudent } from "./TestEntityProvider";
import apiPaths from "../src/properties/apiPaths";
import { studentCollectionName } from "../src/api/entities/StudentEntity";
import { router } from "next/client";

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
    const student = getBaseStudent(id);

    const response: AxiosResponse = getBaseOkResponse(
        getBasePage(apiPaths.students, studentCollectionName, [student])
    );

    render(makeCacheFree(StudentList));
    mockAxios.mockResponseFor({ method: "GET" }, response);

    let studentElement = await screen.findByText(student.callName);
    expect(studentElement).toBeInTheDocument();

    await userEvent.click(studentElement);

    await waitFor(() => {
        expect(router.push).toHaveBeenCalled();
    });
});
