import "@testing-library/jest-dom";
import { act, render, RenderResult, screen, waitFor } from "@testing-library/react";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../src/properties/apiPaths";
import { getBaseActiveEdition, getBaseOkResponse } from "./TestEntityProvider";
import userEvent from "@testing-library/user-event";
import { IEdition } from "../../src/api/entities/EditionEntity";
import { makeCacheFree } from "./Provide";
import EditionOverview from "../../src/components/editionOverview";
jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
});

beforeEach(async () => {
    let confirmSpy = jest.spyOn(window, "confirm");
    confirmSpy.mockImplementation(jest.fn(() => true));
});

describe("Edition overview", () => {
    it("Should render all parts", async () => {
        const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");
        const editionResponse = getBaseOkResponse(edition);
        await act(() => {
            render(makeCacheFree(() => <EditionOverview editionId={"1"} />));
        });

        await waitFor(() => mockAxios.mockResponseFor({ method: "GET" }, editionResponse));

        await waitFor(() => {
            expect(screen.getByTestId("edit-name")).toBeInTheDocument();
            expect(screen.getByTestId("edit-year")).toBeInTheDocument();
            expect(screen.getByTestId("input-active")).toBeInTheDocument();
            expect(screen.getByTestId("edition-name")).toBeInTheDocument();
            expect(screen.getByTestId("edition-year")).toBeInTheDocument();
            expect(screen.getByTestId("edition-active")).toBeInTheDocument();
        });
    });

    it("Changing edition name", async () => {
        const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");
        const editionResponse = getBaseOkResponse(edition);
        await act(() => {
            render(makeCacheFree(() => <EditionOverview editionId={"1"} />));
        });

        await waitFor(() => mockAxios.mockResponseFor({ method: "GET" }, editionResponse));

        await waitFor(() => {
            userEvent.click(screen.getByTestId("edit-name"));
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-name")).toBeInTheDocument();
            expect(screen.getByTestId("save-name")).toBeInTheDocument();
        });

        await userEvent.clear(screen.getByTestId("input-name"));
        await userEvent.type(screen.getByTestId("input-name"), "New Name");
        await userEvent.click(screen.getByTestId("save-name"));

        expect(mockAxios.patch).toHaveBeenCalledWith(
            apiPaths.base + apiPaths.editions + "/1",
            { name: "New Name" },
            expect.anything()
        );
    });

    it("Changing edition year", async () => {
        const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");
        const editionResponse = getBaseOkResponse(edition);
        await act(() => {
            render(makeCacheFree(() => <EditionOverview editionId={"1"} />));
        });

        await waitFor(() => mockAxios.mockResponseFor({ method: "GET" }, editionResponse));

        await waitFor(() => {
            userEvent.click(screen.getByTestId("edit-year"));
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-year")).toBeInTheDocument();
            expect(screen.getByTestId("save-year")).toBeInTheDocument();
        });

        await userEvent.clear(screen.getByTestId("input-year"));
        await userEvent.type(screen.getByTestId("input-year"), "2023");
        await userEvent.click(screen.getByTestId("save-year"));

        expect(mockAxios.patch).toHaveBeenCalledWith(
            apiPaths.base + apiPaths.editions + "/1",
            { year: "2023" },
            expect.anything()
        );
    });

    it("Changing edition year", async () => {
        const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");
        const editionResponse = getBaseOkResponse(edition);
        await act(() => {
            render(makeCacheFree(() => <EditionOverview editionId={"1"} />));
        });

        await waitFor(() => mockAxios.mockResponseFor({ method: "GET" }, editionResponse));

        await waitFor(() => {
            userEvent.click(screen.getByTestId("edit-year"));
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-year")).toBeInTheDocument();
            expect(screen.getByTestId("save-year")).toBeInTheDocument();
        });

        await userEvent.clear(screen.getByTestId("input-year"));
        await userEvent.type(screen.getByTestId("input-year"), "2023");
        await userEvent.click(screen.getByTestId("save-year"));

        expect(mockAxios.patch).toHaveBeenCalledWith(
            apiPaths.base + apiPaths.editions + "/1",
            { year: "2023" },
            expect.anything()
        );
    });

    it("Enter invalid edition year", async () => {
        const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");
        const editionResponse = getBaseOkResponse(edition);
        await act(() => {
            render(makeCacheFree(() => <EditionOverview editionId={"1"} />));
        });

        await waitFor(() => mockAxios.mockResponseFor({ method: "GET" }, editionResponse));

        await waitFor(() => {
            userEvent.click(screen.getByTestId("edit-year"));
        });

        await waitFor(() => {
            expect(screen.getByTestId("input-year")).toBeInTheDocument();
            expect(screen.getByTestId("save-year")).toBeInTheDocument();
        });

        await userEvent.clear(screen.getByTestId("input-year"));
        await userEvent.type(screen.getByTestId("input-year"), "This is clearly not a valid year");
        await userEvent.click(screen.getByTestId("save-year"));

        // Error toast should pop up
        expect(screen.getByTestId("error-year")).toBeInTheDocument();
    });

    it("Changing edition active state", async () => {
        const edition: IEdition = getBaseActiveEdition("1", "OSOC-2022");
        const editionResponse = getBaseOkResponse(edition);
        await act(() => {
            render(makeCacheFree(() => <EditionOverview editionId={"1"} />));
        });

        await waitFor(() => mockAxios.mockResponseFor({ method: "GET" }, editionResponse));

        await waitFor(() => {
            userEvent.click(screen.getByTestId("input-active"));
        });

        // Always ask for confirmation if state needs to be changed
        await waitFor(() => {
            expect(window.confirm).toBeCalled();
        });
    });
});
