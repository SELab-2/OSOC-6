import { getAllEntitiesFromLinksUrl, getEntityOnUrl } from "./baseCalls";
import { ISuggestion, suggestionCollectionName } from "../entities/SuggestionEntity";
import { IUser } from "../entities/UserEntity";
import { getUserOnUrl } from "./userCalls";

/**
 * An interface describing the shape of a suggestion entity with extra entities,
 * so it can be seen as complete.
 */
export interface IFullSuggestion {
    suggestion: ISuggestion;
    coach: IUser;
}

/**
 * Gets all [ISuggestion] entities on an url hosting [ISuggestion]
 * @param url url hosting the [IEntityLinks] of [ISuggestion]
 */
export function getAllSuggestionsFromLinks(url: string): Promise<ISuggestion[]> {
    return <Promise<ISuggestion[]>>getAllEntitiesFromLinksUrl(url, suggestionCollectionName);
}

/**
 * Get an [ISuggestion] from a URL.
 * @param url the url where the [ISuggestion] is hosted on
 */
export function getSuggestionOnUrl(url: string): Promise<ISuggestion> {
    return <Promise<ISuggestion>>getEntityOnUrl(url);
}

/**
 * Get a list of [IFullSuggestion] from a URL hosting .
 * @param url the url where the [IEntityLinks] of [ISuggestion] is hosted on.
 */
export async function getFullSuggestionsFromPage(url: string): Promise<IFullSuggestion[]> {
    const suggestions: ISuggestion[] = await getAllSuggestionsFromLinks(url);
    return await Promise.all(
        suggestions.map(async (suggestion) => ({
            suggestion,
            coach: await getUserOnUrl(suggestion._links.coach.href),
        }))
    );
}
