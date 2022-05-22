import { basePost, getAllEntitiesFromLinksUrl, getEntityOnUrl } from "./baseCalls";
import { ISuggestion, Suggestion, suggestionCollectionName } from "../entities/SuggestionEntity";
import apiPaths from "../../properties/apiPaths";

/**
 * Gets all [ISuggestion] entities on an url hosting [ISuggestion]
 * @param url url hosting the [IEntityLinks] of [ISuggestion]
 */
export function getAllSuggestionsFromLinks(url: string): Promise<ISuggestion[]> {
    return <Promise<ISuggestion[]>>getAllEntitiesFromLinksUrl(url, suggestionCollectionName);
}

/**
 * Creates a project.
 * @param suggestion the suggestion that should be created
 */
export async function createNewSuggestion(suggestion: Suggestion): Promise<ISuggestion> {
    return (await basePost(apiPaths.suggestions, suggestion)).data;
}

/**
 * Get an [ISuggestion] from a URL.
 * @param url the url where the [ISuggestion] is hosted on
 */
export function getSuggestionOnUrl(url: string): Promise<ISuggestion> {
    return <Promise<ISuggestion>>getEntityOnUrl(url);
}
