import { render, screen } from "@testing-library/react";
import LoginError from "../../src/pages/loginError";
import "@testing-library/jest-dom";
import { capitalize } from "../../src/utility/stringUtil";

describe("LoginError page", () => {
    it("should render", async () => {
        render(<LoginError />);

        // Check whether the login form has been rendered in the login page
        const loginForm = screen.getByRole("textbox");
        expect(loginForm).toBeInTheDocument();

        expect(screen.getByTestId("username")).toBeInTheDocument();
        expect(screen.getByTestId("password")).toBeInTheDocument();

        const error = screen.getByText(capitalize("errorMessages:invalid_credentials"));
        expect(error).toBeInTheDocument();

        const submitButton = screen.getByTestId("login-submit");
        expect(submitButton).toBeInTheDocument();
    });
});
