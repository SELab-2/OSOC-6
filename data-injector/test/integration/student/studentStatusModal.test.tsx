import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { SuggestionModal } from "../../../src/components/suggestion/suggestionModal";
import apiPaths from "../../../src/properties/apiPaths";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { StudentStatusModal } from "../../../src/components/student/studentStatusModal";
import { Status } from "../../../src/api/entities/StudentEntity";

afterEach(() => {
    mockAxios.reset();
});

describe("SuggestionModal", () => {
    let studentUrl = apiPaths.students + "/5";
    it("should render", () => {
        render(<StudentStatusModal status={Status.approved} studentUrl={studentUrl} />);
        expect(screen.getByText("Confirm"));
    });

    it("should render modal on click", async () => {
        render(<StudentStatusModal status={Status.approved} studentUrl={studentUrl} />);
        await userEvent.click(screen.getByTestId("confirm-button"));
        expect(screen.getByTestId("change-status"));
    });

    it("confirming modal should post suggestion", async () => {
        render(<StudentStatusModal status={Status.approved} studentUrl={studentUrl} />);
        await userEvent.click(screen.getByTestId("confirm-button"));

        await userEvent.click(screen.getByTestId("confirm-button-modal"));
        await waitFor(() => expect(mockAxios.patch).toHaveBeenCalled());
    });
});
