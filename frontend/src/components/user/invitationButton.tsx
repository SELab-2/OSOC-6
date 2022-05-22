import apiPaths from "../../properties/apiPaths";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import { Invitation } from "../../api/entities/InvitationEntity";
import { Button } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { createInvitation } from "../../api/calls/invitationCalls";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import mailTo from "../../utility/mailTo";
import useSWR from "swr";
import { getAllCommunicationTemplatesFromPage } from "../../api/calls/communicationTemplateCalls";
import { emptyCommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";
import useEdition from "../../hooks/useGlobalEdition";
import { useState } from "react";
import applicationProperties from "../../properties/applicationProperties";

export default function InvitationButton() {
    const { t } = useTranslation("common");
    const { user, error } = useCurrentUser(true);
    const [receivedEditionUrl, setCurrentEditionUrl] = useEdition();

    const { data, error: templateError } = useSWR(
        getQueryUrlFromParams(apiPaths.communicationTemplatesByName, {
            name: applicationProperties.invitationTemplate,
        }),
        getAllCommunicationTemplatesFromPage
    );
    const [invitationUrl, setInvitationUrl] = useState<string>("");
    const [hidden, setHidden] = useState(true);

    const template = data?.at(0) || emptyCommunicationTemplate;

    if (templateError) {
        console.log(templateError);
        return null;
    }

    async function onClick() {
        // Create an invitation
        // We can never call this function if user is undefined.
        const invitation = new Invitation(user!._links.self.href, receivedEditionUrl!);
        const postedInvitation = await createInvitation(invitation);

        const url: string = getQueryUrlFromParams(applicationPaths.registration, {
            invitationToken: postedInvitation.token,
        });

        const registrationUrl = applicationPaths.base + "/" + url;

        setInvitationUrl(registrationUrl);
        setHidden(false);

        document.location.href = mailTo({
            body: template.template + "\n" + registrationUrl,
            subject: template.subject,
            recipients: undefined,
        });
    }

    return (
        <div style={{ marginRight: "0", marginLeft: "auto", maxHeight: "2.6rem" }}>
            <Button data-testid="invite-button" onClick={onClick}>
                {capitalize(t("invite user"))}
            </Button>
            <input
                hidden={hidden}
                type="text"
                data-testid="invitation-url"
                id="invitation-url"
                value={invitationUrl}
                style={{ width: 650, textAlign: "center" }}
                readOnly
            />
        </div>
    );
}
