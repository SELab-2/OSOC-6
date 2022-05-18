import "@testing-library/jest-dom";
import InvitationButton from "../../src/components/user/invitationButton";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    getBaseActiveEdition,
    getBaseInvitation,
    getBaseOkResponse,
    getBasePage,
    getBaseUser,
} from "./TestEntityProvider";
import mockAxios from "jest-mock-axios";
import apiPaths from "../../src/properties/apiPaths";
import { editionCollectionName } from "../../src/api/entities/EditionEntity";
import { UserRole } from "../../src/api/entities/UserEntity";
import { enableCurrentUser, makeCacheFree } from "./Provide";

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
        render(makeCacheFree(InvitationButton));
        await enableCurrentUser(currentUser);

        const baseEdition = getBaseActiveEdition("5", "Active edition");

        const invitationToken = "mockToken";
        // const invitation = new Invitation(currentUser._links.self.href, baseEdition._links.self.href)
        const baseInvitation = getBaseInvitation(invitationToken);
        await userEvent.click(screen.getByTestId("invite-button"));
        mockAxios.mockResponseFor(
            apiPaths.editions,
            getBaseOkResponse(getBasePage(apiPaths.editions, editionCollectionName, [baseEdition]))
        );

        await waitFor(() => {
            mockAxios.mockResponseFor(apiPaths.invitations, getBaseOkResponse(baseInvitation));
        });
    });
});
