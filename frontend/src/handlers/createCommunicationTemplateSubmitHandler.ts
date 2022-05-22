import {
    createNewCommunicationTemplate,
    editCommunicationTemplate,
    extractIdFromCommunicationTemplateUrl,
} from "../api/calls/communicationTemplateCalls";
import {
    CommunicationTemplateEntity,
    ICommunicationTemplate,
} from "../api/entities/CommunicationTemplateEntity";
import Router, { NextRouter } from "next/router";
import applicationPaths from "../properties/applicationPaths";
import { ScopedMutator } from "swr/dist/types";
import apiPaths from "../properties/apiPaths";
import { RouterAction } from "../hooks/routerHooks";
import { ParsedUrlQuery } from "querystring";

export async function createCommunicationTemplateSubmitHandler(
    url: string | null,
    studentId: string,
    values: CommunicationTemplateEntity,
    routerAction: RouterAction,
    //Query needs to be kept because you are in the student
    query: ParsedUrlQuery,
    mutate: ScopedMutator
): Promise<ICommunicationTemplate> {
    let result: ICommunicationTemplate;
    if (url) {
        result = await editCommunicationTemplate(url, values);
    } else {
        result = await createNewCommunicationTemplate(values);
    }
    await Promise.all([
        mutate(apiPaths.communicationTemplates),
        mutate(result._links.self.href, result),
        routerAction({
            pathname:
                "/" +
                applicationPaths.students +
                "/" +
                studentId +
                "/" +
                applicationPaths.communicationRegistration,
            query: { ...query },
        }),
    ]);

    return result;
}
