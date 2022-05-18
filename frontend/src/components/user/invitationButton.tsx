import apiPaths from "../../properties/apiPaths";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import { IEdition } from "../../api/entities/EditionEntity";
import { Invitation } from "../../api/entities/InvitationEntity";
import { Button } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { getAllEditionsFromPage } from "../../api/calls/editionCalls";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { createInvitation } from "../../api/calls/invitationCalls";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import mailTo from "../../utility/mailTo";
import useSWR from "swr";
import { getCommunicationTemplateByName } from "../../api/calls/communicationTemplateCalls";
import { emptyCommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";

export default function InvitationButton() {
    const { t } = useTranslation("common");
    const transformer = useEditionApplicationPathTransformer();
    const { user, error } = useCurrentUser(true);
    let { data: template, error: templateError } = useSWR(
        "yes", // TODO: change to invite
        getCommunicationTemplateByName
    );

    template = template || emptyCommunicationTemplate;

    if (templateError) {
        return null;
    }

    const invitationField = document.getElementById("invitation-url");

    async function onClick() {
        // Get an edition : TODO make this the current edition
        const editions: IEdition[] = await getAllEditionsFromPage(apiPaths.editions);
        const edition: IEdition = editions[0];

        // Create an invitation
        // We can never call this function if user is undefined.
        const invitation = new Invitation(user!._links.self.href, edition._links.self.href);
        const postedInvitation = await createInvitation(invitation);

        const url: string = getQueryUrlFromParams(applicationPaths.registration, {
            invitationToken: postedInvitation.token,
        });

        if (invitationField !== null) {
            invitationField.setAttribute("value", applicationPaths.base + "/" + transformer(url));
            invitationField.style.display = "inline";
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button
                data-testid="invite-button"
                onClick={onClick}
                href={mailTo({
                    body: template.template,
                    subject: template.subject,
                    recipients: undefined,
                })}
            >
                {capitalize(t("invite user"))}
            </Button>
            <input
                type="text"
                data-testid="invitation-url"
                id="invitation-url"
                style={{ display: "none", width: 650, textAlign: "center" }}
                readOnly
            />
        </div>
    );
}
