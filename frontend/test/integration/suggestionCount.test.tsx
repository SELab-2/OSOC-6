import { render, screen, waitFor } from "@testing-library/react";
import { enableActForResponse, makeCacheFree } from "./Provide";
import { SuggestionCount } from "../../src/components/student/suggestionCount";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../src/properties/apiPaths";
import { getBaseOkResponse, getBaseStudent, getBaseTeapot } from "./TestEntityProvider";
import "@testing-library/jest-dom/extend-expect";

describe("suggestion count", () => {
    const studentUrl = apiPaths.students + "/1";

    it("should render without data", () => {
        render(makeCacheFree(() => SuggestionCount({ studentUrl })));
    });

    it("should render with data", async () => {
        render(makeCacheFree(() => SuggestionCount({ studentUrl })));

        const student = getBaseStudent("1");
        await enableActForResponse({ url: studentUrl }, getBaseOkResponse(student));

        await waitFor(() => expect(screen.getByTestId("nosuggestions")).toBeInTheDocument());
    });

    it("should render with data containing suggestions", async () => {
        render(makeCacheFree(() => SuggestionCount({ studentUrl })));

        let student = getBaseStudent("1");
        student.yesSuggestionCount = 5;
        student.maybeSuggestionCount = 3;
        student.noSuggestionCount = 1;
        await enableActForResponse({ url: studentUrl }, getBaseOkResponse(student));

        await waitFor(() => expect(screen.getByTestId("suggestioncount")).toBeInTheDocument());
    });

    it("should handle error", async () => {
        console.log = jest.fn();

        render(makeCacheFree(() => SuggestionCount({ studentUrl })));
        await enableActForResponse({ url: studentUrl }, getBaseTeapot());

        await waitFor(() => expect(console.log).toHaveBeenCalled());
    });
});
