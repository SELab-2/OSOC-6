import axios from "axios";
import apiPaths from "../properties/apiPaths";
import { AxiosConf } from "../api/calls/baseCalls";
import { IUser } from "../api/entities/UserEntity";
import { IEdition } from "../api/entities/EditionEntity";
import { Invitation } from "../api/entities/InvitationEntity";
import Router from "next/router";
import { Button } from "react-bootstrap";
import applicationPaths from "../properties/applicationPaths";
import { getAllEditionsFromUrl } from "../api/calls/editionCalls";

export default function InvitationButton() {
    async function onClick() {
        // Get the logged in user
        const user: IUser = (await axios.get(apiPaths.ownUser, AxiosConf)).data;
        console.log(user);
        // Get an edition
        const editions: IEdition[] = await getAllEditionsFromUrl(apiPaths.editions);
        const edition: IEdition = editions[0];

        // Create an invitation
        const invitation = new Invitation(user._links.self.href, edition._links.self.href);
        const postedInvitation = (await axios.post(apiPaths.invitations, invitation, AxiosConf)).data;
        console.log(postedInvitation);

        const url = applicationPaths.registration + "?invitationToken=" + postedInvitation.token;

        // Log the user out to allow registration
        await axios.get(apiPaths.base + apiPaths.logout, AxiosConf);
        // Redirect to the registration page
        Router.push(url);
    }

    return <Button onClick={onClick}>Create invitation for registration</Button>;
}
