import { render, screen } from '@testing-library/react';
import LoginError from '../src/pages/loginError';
import '@testing-library/jest-dom';

describe('LoginError page', () => {
    it('should render', async () => {
        render(<LoginError />);

        // Check whether the login form has been rendered in the login page
        const loginForm = screen.getByRole('textbox');
        expect(loginForm).toBeInTheDocument();

        expect(screen.getByTestId('username')).toBeInTheDocument();
        expect(screen.getByTestId('password')).toBeInTheDocument();

        const error = screen.getByText('errorMessages:invalid_credentials');
        expect(error).toBeInTheDocument();

        const submitButton = screen.getByRole('button');
        expect(submitButton).toBeInTheDocument();
    });
});
