import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { SuggestionModal } from "../src/components/suggestionModal";
import { SuggestionStrategy } from "../src/api/entities/SuggestionEntity";
import apiPaths from "../src/properties/apiPaths";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { IUser, UserRole } from "../src/api/entities/UserEntity";
import { getBaseOkResponse, getBaseUser } from "./TestEntityProvider";

afterEach(() => {
    mockAxios.reset();
});

describe("SuggestionModal", () => {
    let studentUrl = apiPaths.students + "/5";
    it("should render", () => {
        render(<SuggestionModal suggestion={SuggestionStrategy.yes} style={{}} studentUrl={studentUrl} />);
        expect(screen.getByText("Suggest yes"));
    });

    it("should render modal on click", async () => {
        render(<SuggestionModal suggestion={SuggestionStrategy.yes} style={{}} studentUrl={studentUrl} />);
        await userEvent.click(screen.getByTestId("suggest-button"));
        expect(screen.getByText("Reason for the suggestion:"));
    });

    it("confirming modal should post suggestion", async () => {
        render(<SuggestionModal suggestion={SuggestionStrategy.yes} style={{}} studentUrl={studentUrl} />);
        await userEvent.click(screen.getByTestId("suggest-button"));

        await userEvent.type(screen.getByTestId("suggestion-reason"), "Some reason");
        await userEvent.click(screen.getByTestId("suggestion-confirmation"));
        await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());

        const ownUser: IUser = getBaseUser("5", UserRole.admin, true);
        await waitFor(() =>
            mockAxios.mockResponseFor({ method: "GET", url: apiPaths.ownUser }, getBaseOkResponse(ownUser))
        );

        await waitFor(() => expect(mockAxios.post).toHaveBeenCalled());
    });
});
