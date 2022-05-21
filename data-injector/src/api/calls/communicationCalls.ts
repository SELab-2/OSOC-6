import { basePost, extractIdFromApiEntityUrl, getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";
import { Communication, communicationCollectionName, ICommunication } from "../entities/CommunicationEntity";
import apiPaths from "../../properties/apiPaths";

/**
 * Function getting a communication template on the provided url.
 * @param url the url hosting the communication template.
 */
export function getCommunicationOnUrl(url: string): Promise<ICommunication> {
    return <Promise<ICommunication>>getEntityOnUrl(url);
}

/**
 * Function creating a new [ICommunication] entity on the backend.
 * @param communication the communication that needs to be created.
 */
export async function createNewCommunication(communication: Communication): Promise<ICommunication> {
    return <Promise<ICommunication>>(await basePost(apiPaths.communications, communication)).data;
}

/**
 * Function getting all [ICommunication] entities on an [IPage] url.
 * @param url the [IPage] url hosting the communications.
 */
export function getAllCommunicationFromPage(url: string): Promise<ICommunication[]> {
    return <Promise<ICommunication[]>>getAllEntitiesFromPage(url, communicationCollectionName);
}

/**
 * Function extracting the id of a communication from an entity page.
 * @param url The url to extract the ID from
 */
export function extractIdFromCommunicationUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
