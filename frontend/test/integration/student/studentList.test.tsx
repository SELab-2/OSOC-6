import { StudentList } from "../../../src/components/student/studentList";
import "@testing-library/jest-dom";
import { render, RenderResult, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import { enableUseEditionComponentWrapper, getAxiosCallWithEdition, makeCacheFree } from "../Provide";
import { getBaseActiveEdition, getBaseOkResponse, getBasePage, getBaseStudent } from "../TestEntityProvider";
import apiPaths from "../../../src/properties/apiPaths";
import { studentCollectionName } from "../../../src/api/entities/StudentEntity";
import mockRouter from "next-router-mock";
import { getQueryUrlFromParams } from "../../../src/api/calls/baseCalls";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("student list", () => {
    describe("without url containing filters", () => {
        it("Initializes using axios.get()", () => {
            render(<StudentList isDraggable={false} />);
            expect(mockAxios.get).toHaveBeenCalled();
        });

        it("Render studentlist and click an item", async () => {
            const id = "10";
            const student = getBaseStudent(id);

            const response: AxiosResponse = getBaseOkResponse(
                getBasePage(apiPaths.students, studentCollectionName, [student])
            );

            const initPath = mockRouter.asPath;
            render(makeCacheFree(StudentList));
            mockAxios.mockResponseFor({ method: "GET" }, response);

            let studentElement = await screen.findByText(student.callName);
            expect(studentElement).toBeInTheDocument();

            await userEvent.click(studentElement);

            await waitFor(() => {
                expect(mockRouter.asPath).not.toBe(initPath);
            });
        });
    });

    describe("when url contains filters", () => {
        const query = { freeText: "pears and apples", unmatched: "true" };
        let list: RenderResult;
        const edition = getBaseActiveEdition("1", "edition 1");

        beforeEach(() => {
            mockRouter.query = query;
            list = render(enableUseEditionComponentWrapper(StudentList, edition));
        });

        it("uses the filter", () => {
            expect(mockAxios.get).toHaveBeenCalledWith(
                getAxiosCallWithEdition(getQueryUrlFromParams(apiPaths.studentByQuery, query), edition),
                expect.anything()
            );
        });
    });
});
