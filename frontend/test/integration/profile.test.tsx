import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import { getBaseNoContentResponse, getBaseOkResponse, getBasePage, getBaseUser } from "./TestEntityProvider";
import { UserRole } from "../../src/api/entities/UserEntity";
import { AxiosResponse } from "axios";
import apiPaths from "../../src/properties/apiPaths";
import mockAxios from "jest-mock-axios";
import Profile from "../../src/pages/profile";
import userEvent from "@testing-library/user-event";

jest.mock("next/router", () => require("next-router-mock"));

async function renderNormalUser() {
    render(makeCacheFree(Profile));

    await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalled();
    });

    const user = getBaseUser("2", UserRole.admin, true);
    const response: AxiosResponse = getBaseOkResponse(user);
    act(() => mockAxios.mockResponseFor({ url: apiPaths.ownUser }, response));
}

async function performPatch(editedCallname: string) {
    await renderNormalUser();
    await act(async () => await userEvent.click(screen.getByTestId("edit-callname")));

    const input = screen.getByTestId("input-callname");
    expect(input).toBeInTheDocument();
    await userEvent.type(input, editedCallname);
    await act(async () => await userEvent.click(screen.getByTestId("save-callname")));

    await waitFor(() => expect(mockAxios.patch).toHaveBeenCalled());
}

afterEach(() => {
    mockAxios.reset();
});

describe("User Profile", () => {
    it("Get should get called on render", () => {
        render(makeCacheFree(Profile));
        expect(mockAxios.get).toHaveBeenCalled();
    });

    it("Check Rendering after get", async () => {
        await renderNormalUser();
        expect(screen.getByTestId("profile-overview")).toBeInTheDocument();
    });

    it("Check delete", async () => {
        await renderNormalUser();
        await userEvent.click(screen.getByTestId("delete-userprofile"));

        await waitFor(() => {
            expect(mockAxios.delete).toHaveBeenCalled();
        });

        const response: AxiosResponse = getBaseNoContentResponse();
        act(() => mockAxios.mockResponseFor({ method: "DELETE" }, response));
    });

    it("Check delete fail", async () => {
        await renderNormalUser();
        await userEvent.click(screen.getByTestId("delete-userprofile"));

        await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled());

        // Other response code than expected (doesn't matter what it is)
        // everything except NoContent
        const response: AxiosResponse = getBaseOkResponse({});
        act(() => mockAxios.mockResponseFor({ method: "DELETE" }, response));
    });

    it("Check edit callname", async () => {
        const editedCallname: string = "Edited callname";
        await performPatch(editedCallname);

        const user = getBaseUser("2", UserRole.admin, true);
        user.callName = editedCallname;

        const response: AxiosResponse = getBaseOkResponse(user);
        act(() => mockAxios.mockResponseFor({ method: "PATCH" }, response));
    });

    it("Check edit callname fail", async () => {
        const editedCallname: string = "Edited callname";
        await performPatch(editedCallname);

        const response: AxiosResponse = getBaseNoContentResponse();
        act(() => mockAxios.mockResponseFor({ method: "PATCH" }, response));
    });
});
