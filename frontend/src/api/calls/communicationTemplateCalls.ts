import { CommunicationTemplateEntity, ICommunicationTemplate } from "../entities/CommunicationTemplateEntity";
import { basePost, extractIdFromApiEntityUrl, getEntityOnUrl } from "./baseCalls";
import apiPaths from "../../properties/apiPaths";

/**
 * Function getting a communication template on the provided url.
 * @param url the url hosting the communication template.
 */
export function getCommunicationTemplateOnUrl(url: string): Promise<ICommunicationTemplate> {
    return <Promise<ICommunicationTemplate>>getEntityOnUrl(url);
}

/**
 * Function posting creating a new communication template on the backend.
 * @param template the communication template that needs to be created.
 */
export async function createNewCommunicationTemplate(
    template: CommunicationTemplateEntity
): Promise<ICommunicationTemplate> {
    return <Promise<ICommunicationTemplate>>(await basePost(apiPaths.communicationTemplates, template)).data;
}

/**
 * Function extracting the id of the communication templates from an entity page.
 * @param url The url to extract the ID from
 */
export function extractIdFromCommunicationTemplateUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
