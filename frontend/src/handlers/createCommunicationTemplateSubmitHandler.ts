import {
    createNewCommunicationTemplate,
    editCommunicationTemplate,
    extractIdFromCommunicationTemplateUrl,
} from "../api/calls/communicationTemplateCalls";
import {
    CommunicationTemplateEntity,
    ICommunicationTemplate,
} from "../api/entities/CommunicationTemplateEntity";
import { NextRouter } from "next/router";
import applicationPaths from "../properties/applicationPaths";
import { ScopedMutator } from "swr/dist/types";
import apiPaths from "../properties/apiPaths";

export async function createCommunicationTemplateSubmitHandler(
    url: string | null,
    values: CommunicationTemplateEntity,
    router: NextRouter,
    mutate: ScopedMutator
) {
    let result: ICommunicationTemplate;
    if (url) {
        result = await editCommunicationTemplate(url, values);
    } else {
        result = await createNewCommunicationTemplate(values);
    }
    const id = extractIdFromCommunicationTemplateUrl(result._links.self.href);

    await Promise.all([
        mutate(apiPaths.communicationTemplates),
        mutate(result._links.self.href, result),
        router.push("/" + applicationPaths.communicationTemplateBase + "/" + id),
    ]);
}
