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
import useEdition from "../../hooks/useGlobalEdition";
import {useState} from "react";

export default function InvitationButton() {
    const { t } = useTranslation("common");
    const transformer = useEditionApplicationPathTransformer();
    const { user, error } = useCurrentUser(true);
    const [receivedEditionUrl, setCurrentEditionUrl] = useEdition();
    const { data, error: templateError } = useSWR("Invite", getCommunicationTemplateByName);
    const [invitationUrl, setInvitationUrl] = useState<string>("");
    const [visible, setVisible] = useState(false);

    const template = data || emptyCommunicationTemplate;

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

        const registrationUrl = applicationPaths.base + "/" + transformer(url);

        setInvitationUrl(registrationUrl);
        setVisible(true)

        document.location.href = mailTo({
            body: template.template + "\n" + registrationUrl,
            subject: template.subject,
            recipients: undefined,
        });
    }

    return (
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <Button data-testid="invite-button" onClick={onClick}>
                {capitalize(t("invite user"))}
            </Button>
            <input
                type="text"
                data-testid="invitation-url"
                id="invitation-url"
                value={invitationUrl}
                style={{ width: 650, textAlign: "center", visibility: visible ? "visible" : "hidden"}}
                readOnly
            />
        </div>
    );
}
