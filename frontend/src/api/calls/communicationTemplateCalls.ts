import {
    communicationTemplateCollectionName,
    CommunicationTemplateEntity,
    ICommunicationTemplate,
} from "../entities/CommunicationTemplateEntity";
import {
    basePatch,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
} from "./baseCalls";
import apiPaths from "../../properties/apiPaths";
import { communicationCollectionName } from "../entities/CommunicationEntity";

/**
 * Function getting a communication template on the provided url.
 * @param url the url hosting the communication template.
 */
export function getCommunicationTemplateOnUrl(url: string): Promise<ICommunicationTemplate> {
    return <Promise<ICommunicationTemplate>>getEntityOnUrl(url);
}

/**
 * Function getting all [ICommunicationTemplate] entities on an [IPage] url.
 * @param url the [IPage] url hosting the communications.
 */
export function getAllCommunicationTemplatesFromPage(url: string): Promise<ICommunicationTemplate[]> {
    return <Promise<ICommunicationTemplate[]>>(
        getAllEntitiesFromPage(url, communicationTemplateCollectionName)
    );
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
 * Function posting the creation of a new communication template on the backend.
 * @param template the communication template that needs to be created.
 */
export async function editCommunicationTemplate(
    url: string,
    template: CommunicationTemplateEntity
): Promise<ICommunicationTemplate> {
    return <Promise<ICommunicationTemplate>>(await basePatch(url, template)).data;
}

/**
 * Function extracting the id of the communication templates from an entity page.
 * @param url The url to extract the ID from
 */
export function extractIdFromCommunicationTemplateUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
