import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockAxios from 'jest-mock-axios';
import { makeCacheFree } from './Provide';
import ChangeEmail from '../src/pages/changeEmail';
import ChangePassword from '../src/pages/changePassword';
import { getBaseOkResponse, getBaseUser } from './TestEntityProvider';
import { UserRole } from '../src/api/entities/UserEntity';
import { AxiosResponse } from 'axios';
import apiPaths from '../src/properties/apiPaths';

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

async function renderNormalUser(toRender: Function) {
    render(makeCacheFree(toRender));

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    const user = getBaseUser("2", UserRole.admin, true);
    const response: AxiosResponse = getBaseOkResponse(user);
    act(() => mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response));
}

async function performPatch(string1: string, string2: string, toRender: Function) {
    await renderNormalUser(toRender);

    const input1 = screen.getByTestId("reset-input-1");
    expect(input1).toBeInTheDocument();
    await userEvent.type(input1, string1);

    const input2 = screen.getByTestId("reset-input-2");
    expect(input2).toBeInTheDocument();
    await userEvent.type(input2, string2);
    await act(async () => await userEvent.click(screen.getByTestId("confirm-reset")));

    await waitFor(() => {
        expect(mockAxios.patch).toHaveBeenCalled();
    });
}

describe("Reset Component Tests", () => {

    it('changeEmail should show reset component', () => {
        render(makeCacheFree(ChangeEmail));
        expect(screen.getByTestId("reset-component")).toBeInTheDocument();
    });

    it('changePassword should show reset component', () => {
        render(makeCacheFree(ChangePassword));
        expect(screen.getByTestId("reset-component")).toBeInTheDocument();
    });

    it('changeEmail patch', async () => {
        const newMail: string = "new@mail.com"
        await performPatch(newMail, newMail, ChangeEmail);

        // May be empty, we don't process the returned values
        const response: AxiosResponse = getBaseOkResponse({});
        act(() => mockAxios.mockResponseFor({ method: "PATCH" }, response));
    })

    it('changeEmail patch fail', async () => {
        const newMail: string = "new@mail.com"
        const newMail2: string = "ne@mail.com"
        await renderNormalUser(ChangeEmail);

        const input1 = screen.getByTestId("reset-input-1");
        expect(input1).toBeInTheDocument();
        await userEvent.type(input1, newMail);

        const input2 = screen.getByTestId("reset-input-2");
        expect(input2).toBeInTheDocument();
        await userEvent.type(input2, newMail2);
        await act(async () => await userEvent.click(screen.getByTestId("confirm-reset")));
    })

    it('changePassword patch', async () => {
        const newPassword: string = "new-secure-password"
        await performPatch(newPassword, newPassword, ChangePassword);

        // May be empty, we don't process the returned values
        const response: AxiosResponse = getBaseOkResponse({});
        act(() => mockAxios.mockResponseFor({ method: "PATCH" }, response));
    })

    it('changePassword patch fail', async () => {
        const newPassword: string = "new-secure-password"
        const newPassword2: string = "new-secure-passwod"
        await renderNormalUser(ChangePassword);

        const input1 = screen.getByTestId("reset-input-1");
        expect(input1).toBeInTheDocument();
        await userEvent.type(input1, newPassword);

        const input2 = screen.getByTestId("reset-input-2");
        expect(input2).toBeInTheDocument();
        await userEvent.type(input2, newPassword2);
        await act(async () => await userEvent.click(screen.getByTestId("confirm-reset")));
    })
})