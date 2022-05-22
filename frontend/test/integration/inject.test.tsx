import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Inject from "../../src/pages/inject";
import mockRouter from "next-router-mock";
import applicationPaths from "../../src/properties/applicationPaths";
import { enableCurrentUser, makeCacheFree } from "./Provide";
import ForbiddenCoachRoutes from "../../src/components/util/forbiddenCoachRoutes";
import CreateEdition from "../../src/pages/editions/create";
import mockAxios from "jest-mock-axios";
import { getBaseUser } from "./TestEntityProvider";
import { UserRole } from "../../src/api/entities/UserEntity";

describe("injection page", () => {
    it("should be able to render.", () => {
        render(<Inject />);
    });

    it("is not allowed as coach", async () => {
        await mockRouter.push("/" + applicationPaths.inject);

        render(
            makeCacheFree(() => (
                <ForbiddenCoachRoutes>
                    <Inject />
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
