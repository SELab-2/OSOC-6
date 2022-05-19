import "@testing-library/jest-dom";
import mockRouter from "next-router-mock";
import { act, render, RenderResult, screen } from "@testing-library/react";
import { StudentStatusButton } from "../../../src/components/student/studentStatusButton";
import { Status } from "../../../src/api/entities/StudentEntity";
import userEvent from "@testing-library/user-event";

jest.mock("next/router", () => require("next-router-mock"));

describe("Student status button", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should render", () => {
        render(<StudentStatusButton status={Status.approved} colour="#1DE1AE" />);
    });

    it("should add skillfilter to query", async () => {
        const status: Status = Status.approved;
        mockRouter.query = {};
        let statusFilter: RenderResult = render(<StudentStatusButton status={status} colour="#1DE1AE" />);

        await userEvent.click(statusFilter.getByTestId("suggest-button"));
        expect(mockRouter.query?.status).toEqual(status);
    });

    it("double click should remove filter from query", async () => {
        const status: Status = Status.approved;
        mockRouter.query = {};
        let statusFilter: RenderResult = render(<StudentStatusButton status={status} colour="#1DE1AE" />);

        await userEvent.click(statusFilter.getByTestId("suggest-button"));
        expect(mockRouter.query?.status).toEqual(status);

        await userEvent.click(statusFilter.getByTestId("suggest-button"));
        expect(mockRouter.query?.status).toEqual("");
    });
});
