import { render, screen, waitFor } from "@testing-library/react";
import NavBar from "../../../src/components/util/navBar";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import applicationPaths from "../../../src/properties/applicationPaths";
import mockRouter from "next-router-mock";
import { getBaseUser } from "../TestEntityProvider";
import { UserRole } from "../../../src/api/entities/UserEntity";
import { enableCurrentUser, makeCacheFree } from "../Provide";

describe("Navbar Tests", () => {
    async function setUser() {
        const user = getBaseUser("1", UserRole.admin, true);
        await enableCurrentUser(user);
    }

    it("Should be able to render.", async () => {
        render(<NavBar />);

        await setUser();

        expect(screen.getByTestId("navbar-brand")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-students")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-users")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-projects")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-assignstudents")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-profile")).toBeInTheDocument();
    });

    it("Click brand", async () => {
        render(makeCacheFree(() => <NavBar />));

        await setUser();

        expect(screen.getByTestId("navbar-brand")).toHaveAttribute(
            "href",
            "/" + applicationPaths.assignStudents
        );
    });

    it("Click users", async () => {
        render(makeCacheFree(() => <NavBar />));

        await setUser();

        expect(screen.getByTestId("navbar-users")).toHaveAttribute("href", "/" + applicationPaths.users);
    });

    it("Click students", async () => {
        render(makeCacheFree(() => <NavBar />));

        await setUser();

        expect(screen.getByTestId("navbar-students")).toHaveAttribute(
            "href",
            "/" + applicationPaths.students
        );
    });

    it("Click assign students", async () => {
        render(makeCacheFree(() => <NavBar />));

        await setUser();

        expect(screen.getByTestId("navbar-assignstudents")).toHaveAttribute(
            "href",
            "/" + applicationPaths.assignStudents
        );
    });

    it("Click projects", async () => {
        render(makeCacheFree(() => <NavBar />));

        await setUser();

        expect(screen.getByTestId("navbar-projects")).toHaveAttribute(
            "href",
            "/" + applicationPaths.projects
        );
    });

    it.skip("Click profile", async () => {
        render(<NavBar />);

        await setUser();

        await userEvent.click(screen.getByTestId("navbar-profile"));
        await waitFor(() => {
            expect(mockRouter.pathname).toEqual("/" + applicationPaths.profile);
        });
    });
});
