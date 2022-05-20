import '@testing-library/jest-dom';
import InvitationButton from '../../src/components/user/invitationButton';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getBaseActiveEdition, getBaseInvitation, getBaseOkResponse, getBaseUser } from './TestEntityProvider';
import mockAxios from 'jest-mock-axios';
import apiPaths from '../../src/properties/apiPaths';
import { UserRole } from '../../src/api/entities/UserEntity';
import {
    enableCurrentUser,
    enableUseEditionAxiosCall,
    enableUseEditionComponentWrapper,
    makeCacheFree,
} from './Provide';

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
        await enableUseEditionAxiosCall(baseEdition);

        const invitationToken = "mockToken";
        const baseInvitation = getBaseInvitation(invitationToken, "2");
        await userEvent.click(screen.getByTestId("invite-button"));

        await waitFor(() => {
            mockAxios.mockResponseFor(apiPaths.invitations, getBaseOkResponse(baseInvitation));
        });
    });
});
