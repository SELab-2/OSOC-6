import "@testing-library/jest-dom";
import mockAxios from "jest-mock-axios";
import { act, render, screen, waitFor } from "@testing-library/react";
import { enableUseEditionComponentWrapper, makeCacheFree } from "../Provide";
import EditionPage from "../../../src/pages/editions";
import {
    getBaseActiveEdition,
    getBaseNoContentResponse,
    getBaseOkResponse,
    getBaseUser,
} from "../TestEntityProvider";
import { IEdition } from "../../../src/api/entities/EditionEntity";
import EditionRowComponent from "../../../src/components/edition/editionRowComponent";
import userEvent from "@testing-library/user-event";
import { AxiosResponse } from "axios";
import { GlobalStateProvider } from "../../../src/context/globalContext";
import apiPaths from "../../../src/properties/apiPaths";
import { UserRole } from "../../../src/api/entities/UserEntity";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("EditionList", () => {
    it("Should have overview component", () => {
        render(makeCacheFree(EditionPage));
        expect(screen.getByTestId("edition-list")).toBeInTheDocument();
    });

    it("Should have rows for the editions", () => {
        const edition: IEdition = getBaseActiveEdition("3", "edition 1");
        act(() => {
            render(<EditionRowComponent key={edition.name} edition={edition} />);
        });
        expect(screen.getByTestId("edition-row")).toBeInTheDocument();
    });

    it("Should call axios.get() upon rendering", async () => {
        render(makeCacheFree(EditionPage));
        expect(mockAxios.get).toHaveBeenCalled();
    });

    it("edition delete", async () => {
        const edition: IEdition = getBaseActiveEdition("3", "edition 1");
        render(makeCacheFree(() => <EditionRowComponent key={edition.name} edition={edition} />));

        await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());

        const responseUser: AxiosResponse = getBaseOkResponse(getBaseUser("5", UserRole.admin, true));
        await waitFor(() => {
            act(() => mockAxios.mockResponseFor({ url: apiPaths.ownUser }, responseUser));
        });

        await waitFor(() => expect(screen.getByTestId("list-delete-edition")).toBeInTheDocument());
        await userEvent.click(screen.getByTestId("list-delete-edition"));
        await waitFor(() => expect(mockAxios.delete).toHaveBeenCalled());

        const response: AxiosResponse = getBaseNoContentResponse();
        act(() => mockAxios.mockResponseFor({ url: edition._links.self.href }, response));
    });

    it("edition view", async () => {
        const edition: IEdition = getBaseActiveEdition("3", "edition 1");
        render(
            makeCacheFree(() =>
                enableUseEditionComponentWrapper(
                    () => <EditionRowComponent key={edition.name} edition={edition} />,
                    edition
                )
            )
        );

        await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
        const responseUser: AxiosResponse = getBaseOkResponse(getBaseUser("5", UserRole.admin, true));
        act(() => mockAxios.mockResponseFor({ url: apiPaths.ownUser }, responseUser));

        await userEvent.click(screen.getByTestId("list-view-edition"));
    });
});
