import mockAxios from "jest-mock-axios";
import { render, screen, waitFor } from "@testing-library/react";
import { enableActForResponse, makeCacheFree } from "../Provide";
import CreateEdition from "../../../src/pages/editions/create";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import mockRouter from "next-router-mock";
import applicationPaths from "../../../src/properties/applicationPaths";
import { IEdition } from "../../../src/api/entities/EditionEntity";
import { getBaseActiveEdition, getBaseOkResponse } from "../TestEntityProvider";

jest.mock("next/router", () => require("next-router-mock"));

afterEach(() => {
    mockAxios.reset();
});

describe("EditionCreate", () => {
    it("Should have form", () => {
        render(makeCacheFree(CreateEdition));
        expect(screen.getByTestId("active")).toBeInTheDocument();
        expect(screen.getByTestId("name")).toBeInTheDocument();
    });

    it("Fill in form and submit", async () => {
        render(makeCacheFree(CreateEdition));

        const nameInput = screen.getByTestId("name");
        await userEvent.type(nameInput, "Edition Test");

        const yearInput = screen.getByTestId("year");
        await userEvent.type(yearInput, "2022");

        const active = screen.getByTestId("active");
        await userEvent.type(active, "true");

        await userEvent.click(screen.getByTestId("submit"));

        await waitFor(() => {
            expect(mockAxios.post).toHaveBeenCalled();
        });

        const id = "3";
        const edition: IEdition = getBaseActiveEdition(id, "edition 1");

        await enableActForResponse({ method: "post" }, getBaseOkResponse(edition));

        await waitFor(() => {
            expect(mockRouter.pathname).toEqual("/" + applicationPaths.editionBase + "/" + id);
        });
    });
});
