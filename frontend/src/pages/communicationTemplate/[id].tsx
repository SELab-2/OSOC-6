import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getCommunicationTemplateOnUrl } from "../../api/calls/communicationTemplateCalls";
import { Button } from "react-bootstrap";
import mailTo from "../../utility/mailTo";

export default function CommunicationTemplateInfo() {
    const router = useRouter();
    const query = router.query as { id: string };
    const templateId = query.id;

    const { data, error } = useSWR(
        apiPaths.communicationTemplates + "/" + templateId,
        getCommunicationTemplateOnUrl
    );
    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div data-testid="communication-template-info">
            <h1>{"Communication Template: " + data?.name}</h1>
            <Button
                data-testid="mail-to-button"
                href={mailTo({
                    body: data?.template,
                    subject: data?.subject,
                })}
            >
                Open in mail application
            </Button>
            <div className="text-wrap">{"subject: " + data?.subject}</div>
            <hr />
            <div className="text-wrap">{data?.template}</div>
        </div>
    );
}
