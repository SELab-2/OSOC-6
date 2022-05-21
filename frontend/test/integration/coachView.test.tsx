import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { enableCurrentUser, makeCacheFree } from "./Provide";
import EditionList from "../../src/components/edition/editionList";
import { ProjectList } from "../../src/components/project/projectList";
import NavBar from "../../src/components/util/navBar";
import mockRouter from "next-router-mock";
import applicationPaths from "../../src/properties/applicationPaths";
import ForbiddenCoachRoutes from "../../src/components/util/forbiddenCoachRoutes";
import CreateEdition from "../../src/pages/editions/create";
import mockAxios from "jest-mock-axios";
import { getBaseUser } from "./TestEntityProvider";
import { UserRole } from "../../src/api/entities/UserEntity";

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
        await enableCurrentUser(getBaseUser("5", UserRole.coach, true));

        await waitFor(() => {
            expect(mockRouter.asPath).toEqual("/" + applicationPaths.error);
        });
    });
});
