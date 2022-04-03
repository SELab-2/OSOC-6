import Login from '../src/pages/login';
import LoginForm from "../src/components/loginForm";
import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event'

describe('Login page', () => {
    it('should render', async () => {
        render(<Login />);

        // Check whether the login form has been rendered in the login page
        const loginForm = screen.getByRole('textbox');
        expect(loginForm).toBeInTheDocument();

        expect(screen.getByTestId("username")).toBeInTheDocument();
        expect(screen.getByTestId("password")).toBeInTheDocument();

        const submitButton = screen.getByRole('button');
        expect(submitButton).toBeInTheDocument();
    });
});

test('Test whether the login sends the form', async() => {
    const submitLogin = jest.fn()
    const login = render(<LoginForm submitHandler={submitLogin}/>);

    const username = login.getByTestId("username")
    const password = login.getByTestId("password")

    await userEvent.type(username, "test@mail.com")
    await userEvent.type(password, "pass")

    await userEvent.click(login.getByRole('button'))

    await waitFor(() => {
        expect(submitLogin).toBeCalled()
    })
});
