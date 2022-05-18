import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from "./Provide";
import EditionRowComponent from "../../src/components/edition/editionRowComponent";
import EditionList from "../../src/components/edition/editionList";
import { ProjectList } from "../../src/components/project/projectList";
import NavBar from "../../src/components/util/navBar";
import mockRouter from "next-router-mock";
import applicationPaths from "../../src/properties/applicationPaths";
import ForbiddenCoachRoutes from "../../src/components/util/forbiddenCoachRoutes";
import CreateEdition from "../../src/pages/editions/create";
import CreateEditionForm from "../../src/components/edition/createEditionForm";
import mockAxios from "jest-mock-axios";
import { AxiosResponse } from "axios";
import { getBaseOkResponse, getBaseUser } from "./TestEntityProvider";
import { UserRole } from "../../src/api/entities/UserEntity";
import apiPaths from "../../src/properties/apiPaths";

describe("Coach View", () => {
    it("New edition button not visible", () => {
        render(makeCacheFree(() => <EditionList />));
        expect(screen.queryByTestId("new-edition")).not.toBeInTheDocument();
    });

    it("New project button not visible", () => {
        render(makeCacheFree(ProjectList));
        expect(screen.queryByTestId("new-project-button")).not.toBeInTheDocument();
    });

    it("Users button in navbar not visible", () => {
        render(makeCacheFree(() => <NavBar />));
        expect(screen.queryByTestId("navbar-users")).not.toBeInTheDocument();
    });

    it("Unallowed path", async () => {
        await mockRouter.push("/" + applicationPaths.editionCreate);

        render(
            makeCacheFree(() => (
                <ForbiddenCoachRoutes>
                    <CreateEdition />
                </ForbiddenCoachRoutes>
            ))
        );

        await waitFor(() => expect(mockAxios.get).toHaveBeenCalled());
        const responseUser: AxiosResponse = getBaseOkResponse(getBaseUser("5", UserRole.admin, true));
        act(() => mockAxios.mockResponseFor({ url: apiPaths.ownUser }, responseUser));

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual("/" + applicationPaths.error);
        });
    });
});
