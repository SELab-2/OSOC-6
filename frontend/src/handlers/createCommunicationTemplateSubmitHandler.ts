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
): Promise<ICommunicationTemplate> {
    let result: ICommunicationTemplate;
    console.log(url);
    if (url) {
        result = await editCommunicationTemplate(url, values);
        console.log(result);
    } else {
        result = await createNewCommunicationTemplate(values);
        console.log(result);
    }
    const id = router.query.id;

    await Promise.all([
        mutate(apiPaths.communicationTemplates),
        mutate(result._links.self.href, result),
        router.replace({
            pathname: "/" + applicationPaths.students + "/" + id + "/" + applicationPaths.communicationRegistration,
            query: {...router.query}
        }),
    ]);

    return result;
}
