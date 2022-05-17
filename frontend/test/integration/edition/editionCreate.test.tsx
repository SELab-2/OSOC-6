import mockAxios from "jest-mock-axios";
import { act, render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "../Provide";
import CreateEdition from "../../../src/pages/editions/create";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("EditionCreate", () => {
    it("Should have form", () => {
        render(makeCacheFree(CreateEdition));
        expect(screen.getByTestId("active")).toBeInTheDocument();
        expect(screen.getByTestId("name")).toBeInTheDocument();
    });

    it("Fill in form and submit", async () => {
        render(makeCacheFree(CreateEdition));

        const nameInput = screen.getByTestId("name");
        await userEvent.type(nameInput, "Edition Test");

        const yearInput = screen.getByTestId("year");
        await userEvent.type(yearInput, "2022");

        const active = screen.getByTestId("active");
        await userEvent.type(active, "true");

        await userEvent.click(screen.getByTestId("submit"));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalled();
        });
    });
});
