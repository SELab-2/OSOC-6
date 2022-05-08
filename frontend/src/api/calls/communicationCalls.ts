import { extractIdFromApiEntityUrl, getEntityOnUrl } from "./baseCalls";
import { ICommunication } from "../entities/CommunicationEntity";

/**
 * Function getting a communication template on the provided url.
 * @param url the url hosting the communication template.
 */
export function getCommunicationOnUrl(url: string): Promise<ICommunication> {
    return <Promise<ICommunication>>getEntityOnUrl(url);
}

/**
 * Function extracting the id of a communication from an entity page.
 * @param url The url to extract the ID from
 */
export function extractIdFromCommunicationUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
