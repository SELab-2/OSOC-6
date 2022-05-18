import "@testing-library/jest-dom";
import { IEdition } from "../../src/api/entities/EditionEntity";
import { getBaseActiveEdition } from "./TestEntityProvider";
import { render, screen, waitFor } from "@testing-library/react";
import { enableUseEditionComponentWrapper, makeCacheFree } from "./Provide";
import EditionRowComponent from "../../src/components/edition/editionRowComponent";
import userEvent from "@testing-library/user-event";
import BeginPage from "../../src/pages";
import mockRouter from "next-router-mock";
import applicationPaths from "../../src/properties/applicationPaths";

describe("Index Page", () => {
    it("render index page should replace in router", async () => {
        render(makeCacheFree(BeginPage));

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual("/" + applicationPaths.assignStudents);
        });
    });
});
