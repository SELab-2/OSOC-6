import "@testing-library/jest-dom";
import InvitationButton from "../../src/components/user/invitationButton";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    getBaseActiveEdition,
    getBaseInvitation,
    getBaseOkResponse,
    getBaseTeapot,
    getBaseUser,
} from "./TestEntityProvider";
import apiPaths from "../../src/properties/apiPaths";
import { UserRole } from "../../src/api/entities/UserEntity";
import {
    enableActForResponse,
    enableCurrentUser,
    enableUseEditionComponentWrapper,
    makeCacheFree,
} from "./Provide";
import { getQueryUrlFromParams } from "../../src/api/calls/baseCalls";
import applicationProperties from "../../src/properties/applicationProperties";

describe("InvitationButton", () => {
    const currentUser = getBaseUser("10", UserRole.admin, true);
    it("should render", async () => {
        let invitation = render(<InvitationButton />);

        const inviteButton = await invitation.getByTestId("invite-button");
        const invitationUrl = await invitation.getByTestId("invitation-url");

        expect(inviteButton).toBeInTheDocument();
        expect(invitationUrl).toBeInTheDocument();
        expect(invitationUrl).not.toBeVisible();
    });

    it("click", async () => {
        const baseEdition = getBaseActiveEdition("5", "Active edition");
        render(makeCacheFree(() => enableUseEditionComponentWrapper(InvitationButton, baseEdition)));
        await enableCurrentUser(currentUser);

        const invitationToken = "mockToken";
        const baseInvitation = getBaseInvitation(invitationToken, "2");
        await userEvent.click(screen.getByTestId("invite-button"));

        await enableActForResponse(apiPaths.invitations, getBaseOkResponse(baseInvitation));
    });
});
