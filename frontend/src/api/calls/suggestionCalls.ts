import { getAllEntitiesFromLinksUrl, getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";
import { IFullSuggestion, ISuggestion, suggestionCollectionName } from "../entities/SuggestionEntity";
import { IUser } from "../entities/UserEntity";
import { getUserOnUrl } from "./userCalls";

/**
 * Fetches all students on a given StudentLinksUrl
 */
export function getAllSuggestionsFromLinks(url: string): Promise<ISuggestion[]> {
    return <Promise<ISuggestion[]>>getAllEntitiesFromLinksUrl(url, suggestionCollectionName);
}

export function getSuggestionOnUrl(url: string): Promise<ISuggestion> {
    return <Promise<ISuggestion>>getEntityOnUrl(url);
}

export async function getFullSuggestionFromSuggestion(suggestion: ISuggestion): Promise<IFullSuggestion> {
    const coach: IUser = await getUserOnUrl(suggestion._links.coach.href);
    return { suggestion: suggestion, coach: coach };
}
