import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { SuggestionModal } from "../../src/components/suggestion/suggestionModal";
import { SuggestionStrategy } from "../../src/api/entities/SuggestionEntity";
import apiPaths from "../../src/properties/apiPaths";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import { UserRole } from "../../src/api/entities/UserEntity";
import {getBaseTeapot, getBaseUser} from "./TestEntityProvider";
import { capitalize } from "../../src/utility/stringUtil";
import {enableActForResponse, enableCurrentUser, makeCacheFree} from "./Provide";
import {SuggestionCount} from "../../src/components/student/suggestionCount";
import applicationPaths from "../../src/properties/applicationPaths";

afterEach(() => {
    mockAxios.reset();
});

describe("SuggestionModal", () => {
    let studentUrl = apiPaths.students + "/5";
    const currentUser = getBaseUser("10", UserRole.coach, true);

    it("should render", async () => {
        render(
            makeCacheFree(() => (
                <SuggestionModal suggestion={SuggestionStrategy.yes} colour="blue" studentUrl={studentUrl} />
            ))
        );

        await enableCurrentUser(currentUser);

        await waitFor(() => {
            expect(screen.getByText("Suggest yes"));
        });
    });

    it("should render modal on click", async () => {
        render(
            makeCacheFree(() => (
                <SuggestionModal suggestion={SuggestionStrategy.yes} colour="blue" studentUrl={studentUrl} />
            ))
        );
        await enableCurrentUser(currentUser);

        await waitFor(() => {
            screen.getByTestId("suggest-button");
        });

        await userEvent.click(screen.getByTestId("suggest-button"));

        await waitFor(() => {
            expect(screen.getByText(capitalize("reason suggestion:")));
        });
    });

    it("confirming modal should post suggestion", async () => {
        render(
            makeCacheFree(() => (
                <SuggestionModal suggestion={SuggestionStrategy.yes} colour="blue" studentUrl={studentUrl} />
            ))
        );
        await enableCurrentUser(currentUser);

        await waitFor(() => {
            screen.getByTestId("suggest-button");
        });

        await userEvent.click(screen.getByTestId("suggest-button"));

        await userEvent.type(screen.getByTestId("suggestion-reason"), "Some reason");
        await userEvent.click(screen.getByTestId("suggestion-confirmation"));
        await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());

        await waitFor(() => expect(mockAxios.post).toHaveBeenCalled());
    });

    it("should handle error", async () => {
        console.log = jest.fn()

        render(
            makeCacheFree(() => (
                <SuggestionModal suggestion={SuggestionStrategy.yes} colour="blue" studentUrl={studentUrl} />
            ))
        );
        await enableActForResponse({url: apiPaths.ownUser}, getBaseTeapot())

        await waitFor(() => expect(console.log).toHaveBeenCalled());
    });
});
