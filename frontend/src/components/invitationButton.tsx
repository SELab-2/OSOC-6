import apiPaths from "../properties/apiPaths";
import { basePost, getQueryUrlFromParams, useEditionPathTransformer } from "../api/calls/baseCalls";
import { IUser } from "../api/entities/UserEntity";
import { IEdition } from "../api/entities/EditionEntity";
import { Invitation } from "../api/entities/InvitationEntity";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";
import applicationPaths from "../properties/applicationPaths";
import { getAllEditionsFromPage } from "../api/calls/editionCalls";
import { getOwnUser, logoutUser } from "../api/calls/userCalls";

export default function InvitationButton() {
    const router = useRouter();
    const transformer = useEditionPathTransformer();

    async function onClick() {
        // Get the logged in user
        const user: IUser = await getOwnUser();

        // Get an edition
        const editions: IEdition[] = await getAllEditionsFromPage(apiPaths.editions);
        const edition: IEdition = editions[0];

        // Create an invitation
        const invitation = new Invitation(user._links.self.href, edition._links.self.href);
        const postedInvitation = (await basePost(apiPaths.invitations, invitation, {})).data;

        const url = getQueryUrlFromParams(applicationPaths.registration, {
            invitationToken: postedInvitation.token,
        });

        await Promise.all([logoutUser(), router.push(transformer(url))]);
    }

    return <Button onClick={onClick}>Create invitation for registration</Button>;
}
