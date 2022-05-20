import "@testing-library/jest-dom";
import { render, RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import ForgotPassword from "../../src/pages/forgotPassword";
import { makeCacheFree } from "./Provide";
import apiPaths from "../../src/properties/apiPaths";

jest.mock("next/router", () => require("next-router-mock"));

describe("forgot password", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("without data", () => {
        it("renders", () => {
            const page = render(<ForgotPassword />);
            expect(page.getByTestId("forgot-password-form")).toBeInTheDocument();
        });
    });

    describe("with data", () => {
        let page: RenderResult;
        beforeEach(async () => {
            page = render(makeCacheFree(ForgotPassword));
        });

        const email = "test@test.com";

        it("can submit", async () => {
            const form = (await page.findByTestId("email")) as HTMLInputElement;
            await userEvent.type(form, email);

            const submitButton = await page.findByTestId("forgot-submit");

            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalledWith(
                    apiPaths.forgotPassword,
                    email,
                    expect.anything()
                );
            });
        });
    });
});
