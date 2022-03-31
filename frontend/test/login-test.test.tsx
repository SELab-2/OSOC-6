import Login from "../src/pages/login";
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Login page', () => {
    it("should render", async () => {
        render(
            <Login />,
        );

    });
})
// describe('Test whether the login sends the form', ()
//
// )