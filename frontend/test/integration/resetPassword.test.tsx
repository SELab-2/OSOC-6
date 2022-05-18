import "@testing-library/jest-dom";
import {render, RenderResult, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from "jest-mock-axios";
import {makeCacheFree} from "./Provide";
import apiPaths from "../../src/properties/apiPaths";
import ResetPassword from "../../src/pages/resetPassword";
import mockRouter from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

describe("reset password", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const resetToken: string = "123-abc";

    beforeEach(() => {
        mockRouter.query = {
            token: resetToken,
        };
    });

    describe("without data", () => {
        it("renders", () => {
            const page = render(<ResetPassword />);
            expect(page.getByTestId("reset-component")).toBeInTheDocument();
        });
    });

    describe("with data", () => {
        let page: RenderResult;
        beforeEach(async () => {
            page = render(makeCacheFree(ResetPassword));
        });

        const newpassword: string = "newpw-123";

        it("can submit", async () => {
            const input1 = (await page.findByTestId("reset-input-1")) as HTMLInputElement;
            const input2 = (await page.findByTestId("reset-input-2")) as HTMLInputElement;

            await userEvent.type(input1, newpassword);
            await userEvent.type(input2, newpassword);

            const submitButton = await page.findByTestId("confirm-reset");

            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockAxios.post).toHaveBeenCalledWith(
                    apiPaths.resetPassword + "?token=" + resetToken,
                    newpassword,
                    expect.anything()
                );
            });
        });
    });
});
