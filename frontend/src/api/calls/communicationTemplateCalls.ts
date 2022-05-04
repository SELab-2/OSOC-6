import { CommunicationTemplateEntity, ICommunicationTemplate } from "../entities/CommunicationTemplateEntity";
import { basePost, extractIdFromApiEntityUrl } from "./baseCalls";
import apiPaths from "../../properties/apiPaths";

export async function createNewCommunicationTemplate(
    template: CommunicationTemplateEntity
): Promise<ICommunicationTemplate> {
    return <Promise<ICommunicationTemplate>>(await basePost(apiPaths.communicationTemplates, template)).data;
}

export function extractIdFromCommunicationTemplateUrl(url: string) {
    return extractIdFromApiEntityUrl(url);
}
