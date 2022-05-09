import { ISuggestion } from "../api/entities/SuggestionEntity";
import { IUser } from "../api/entities/UserEntity";
import { getUserOnUrl } from "../api/calls/userCalls";
import { getAllSuggestionsFromLinks, getSuggestionOnUrl } from "../api/calls/suggestionCalls";
import useSWR from "swr";
import { CommonSWRConfig } from "./shared";

/**
 * An interface describing the shape of a suggestion entity with extra entities,
 * so it can be seen as complete.
 */
export interface IFullSuggestion {
    suggestion?: ISuggestion;
    coach?: IUser;
}

/**
 * Get a [IFullSuggestion] from a URL.
 * @param url the url where the [ISuggestion] is hosted on.
 */
export function useFullSuggestions(
    url: string,
    config?: CommonSWRConfig
): { data?: IFullSuggestion; error?: Error } {
    const { data: suggestion, error: suggestionError } = useSWR(url, getSuggestionOnUrl, config);
    const { data: coach, error: coachError } = useSWR(
        suggestion ? suggestion._links.coach.href : null,
        getUserOnUrl,
        config
    );
    if (suggestionError || coachError) {
        return {
            error: suggestionError || coachError,
        };
    }
    return {
        data: {
            suggestion,
            coach,
        },
    };
}
