import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { screen, render, waitFor } from "@testing-library/react";
import { makeCacheFree } from "../Provide";
import WarningToast from "../../../src/components/util/warningToast";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("Warning toast tests", () => {
    it("Should be able to render", async () => {
        await render(makeCacheFree(() => WarningToast({ message: "Some random message" })));
        await waitFor(async () => {
            expect(screen.getByText("Some random message")).toBeInTheDocument();
            expect(screen.getByTestId("warning-toast")).toBeInTheDocument();
            // Add test to check onClose method
        });
    });
});
