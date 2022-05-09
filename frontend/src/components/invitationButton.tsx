import apiPaths from "../properties/apiPaths";
import { basePost, getQueryUrlFromParams } from "../api/calls/baseCalls";
import { IUser } from "../api/entities/UserEntity";
import { IEdition } from "../api/entities/EditionEntity";
import { Invitation } from "../api/entities/InvitationEntity";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import applicationPaths from "../properties/applicationPaths";
import { getAllEditionsFromPage } from "../api/calls/editionCalls";
import { logoutUser } from "../api/calls/userCalls";
import { useEditionPathTransformer } from "../hooks/utilHooks";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function InvitationButton() {
    const router = useRouter();
    const transformer = useEditionPathTransformer();
    const { user, error } = useCurrentUser(true);

    if (error || !user) {
        return null;
    }

    async function onClick() {
        // Get an edition
        const editions: IEdition[] = await getAllEditionsFromPage(apiPaths.editions);
        const edition: IEdition = editions[0];

        // Create an invitation
        // We can never call this function if user is undefined.
        const invitation = new Invitation(user!._links.self.href, edition._links.self.href);
        const postedInvitation = (await basePost(apiPaths.invitations, invitation, {})).data;

        const url = getQueryUrlFromParams(applicationPaths.registration, {
            invitationToken: postedInvitation.token,
        });

        await Promise.all([logoutUser(), router.push(transformer(url))]);
    }

    return <Button onClick={onClick}>Create invitation for registration</Button>;
}
