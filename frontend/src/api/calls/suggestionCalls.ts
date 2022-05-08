import { getAllEntitiesFromLinksUrl, getEntityOnUrl } from "./baseCalls";
import { ISuggestion, suggestionCollectionName } from "../entities/SuggestionEntity";
import { IUser } from "../entities/UserEntity";
import { getUserOnUrl } from "./userCalls";

export interface IFullSuggestion {
    suggestion: ISuggestion;
    coach: IUser;
}

/**
 * Fetches all students on a given StudentLinksUrl
 */
export function getAllSuggestionsFromLinks(url: string): Promise<ISuggestion[]> {
    return <Promise<ISuggestion[]>>getAllEntitiesFromLinksUrl(url, suggestionCollectionName);
}

export function getSuggestionOnUrl(url: string): Promise<ISuggestion> {
    return <Promise<ISuggestion>>getEntityOnUrl(url);
}

export async function getFullSuggestionsFromPage(url: string): Promise<IFullSuggestion[]> {
    const suggestions: ISuggestion[] = await getAllSuggestionsFromLinks(url);
    return await Promise.all(
        suggestions.map(async (suggestion) => ({
            suggestion,
            coach: await getUserOnUrl(suggestion._links.coach.href),
        }))
    );
}
