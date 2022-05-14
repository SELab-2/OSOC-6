import { IInvitation, Invitation } from "../entities/InvitationEntity";
import { basePost } from "./baseCalls";
import apiPaths from "../../properties/apiPaths";

export async function createInvitation(invitation: Invitation): Promise<IInvitation> {
    return (await basePost(apiPaths.invitations, invitation)).data;
}
