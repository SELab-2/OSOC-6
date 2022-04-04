import {render, screen} from "@testing-library/react";
import LoginError from "../src/pages/login_error";
import '@testing-library/jest-dom';

describe('Login_error page', () => {
    it('should render', async () => {
        render(<LoginError />);

        // Check whether the login form has been rendered in the login page
        const loginForm = screen.getByRole('textbox');
        expect(loginForm).toBeInTheDocument();

        expect(screen.getByTestId('username')).toBeInTheDocument();
        expect(screen.getByTestId('password')).toBeInTheDocument();

        const error = screen.getByText('Invalid username and/or password.');
        expect(error).toBeInTheDocument();

        const submitButton = screen.getByRole('button');
        expect(submitButton).toBeInTheDocument();
    });
});