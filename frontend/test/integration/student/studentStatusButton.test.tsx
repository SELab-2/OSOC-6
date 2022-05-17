import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import {act, render, RenderResult, screen} from "@testing-library/react";
import {StudentStatusButton} from "../../../src/components/student/studentStatusButton";
import {Status} from "../../../src/api/entities/StudentEntity";
import userEvent from "@testing-library/user-event";

jest.mock("next/router", () => require("next-router-mock"));

describe("Student status button", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render", () => {
        render(<StudentStatusButton
            status={Status.approved}
            style={{ color: "#1DE1AE", borderColor: "#1DE1AE", width: 150 }}/>);
    });

    it("should alter the query", async () => {
        const status: Status = Status.approved
        mockRouter.query = {};
        let statusFilter: RenderResult = render(<StudentStatusButton
            status={status}
            style={{ color: "#1DE1AE", borderColor: "#1DE1AE", width: 150 }}/>);

        await userEvent.click(statusFilter.getByTestId("suggest-button"));
        expect(mockRouter.query?.status).toEqual(status);
    })
});
