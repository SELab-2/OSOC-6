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
 * SWR based hook returning a [IFullSuggestion].
 * @param url the url hosting the [ISuggestion] entity that should be completed.
 * @param config [CommonSWRConfig] config that allows to set shared SWR configurations.
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
    return {
        data: {
            suggestion,
            coach,
        },
        error: suggestionError || coachError,
    };
}
