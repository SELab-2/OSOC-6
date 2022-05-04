import { CommunicationTemplateEntity, ICommunicationTemplate } from "../entities/CommunicationTemplateEntity";
import { basePost, extractIdFromApiEntityUrl, getEntityOnUrl } from "./baseCalls";
import apiPaths from "../../properties/apiPaths";

export function getCommunicationTemplateOnUrl(url: string): Promise<ICommunicationTemplate> {
    return <Promise<ICommunicationTemplate>>getEntityOnUrl(url);
}

export async function createNewCommunicationTemplate(
    template: CommunicationTemplateEntity
): Promise<ICommunicationTemplate> {
    return <Promise<ICommunicationTemplate>>(await basePost(apiPaths.communicationTemplates, template)).data;
}

export function extractIdFromCommunicationTemplateUrl(url: string) {
    return extractIdFromApiEntityUrl(url);
}
