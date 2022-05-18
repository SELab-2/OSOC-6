import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { makeCacheFree } from './Provide';
import EditionRowComponent from '../../src/components/edition/editionRowComponent';
import EditionList from '../../src/components/edition/editionList';
import { ProjectList } from '../../src/components/project/projectList';
import NavBar from '../../src/components/util/navBar';
import mockRouter from 'next-router-mock';
import applicationPaths from '../../src/properties/applicationPaths';
import ForbiddenCoachRoutes from '../../src/components/util/forbiddenCoachRoutes';
import CreateEdition from '../../src/pages/editions/create';

describe("Coach View", () => {
    it("New edition button not visible", () => {
        render(makeCacheFree(() => <EditionList/>));
        expect(screen.queryByTestId("new-edition")).not.toBeInTheDocument();
    })

    it("New project button not visible", () => {
        render(makeCacheFree(ProjectList));
        expect(screen.queryByTestId("new-project-button")).not.toBeInTheDocument();
    })

    it("Users button in navbar not visible", () => {
        render(makeCacheFree(() => <NavBar/>));
        expect(screen.queryByTestId("navbar-users")).not.toBeInTheDocument();
    })

    it("Unallowed path", async () => {
        await mockRouter.push(applicationPaths.editionCreate);
        render(makeCacheFree(() => (
            <ForbiddenCoachRoutes />
        )))
        await waitFor(() => {
            expect(mockRouter.pathname).toEqual(applicationPaths.error);
        });
    })
});