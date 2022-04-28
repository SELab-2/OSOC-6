import { getAllEntitiesFromPage, getEntityOnUrl, getQueryUrlFromParams } from "./baseCalls";
import { editionCollectionName, IEdition } from "../entities/EditionEntity";
import apiPaths from "../../properties/apiPaths";
import { IUser } from "../entities/UserEntity";
import useSWR from "swr";
import { getOwnUser } from "./userCalls";

export function getAllEditionsFromPage(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromPage(url, editionCollectionName);
}

export function getEditionByName(editionName: string): Promise<IEdition> {
    return <Promise<IEdition>>getEntityOnUrl(getQueryUrlFromParams(apiPaths.editionByName, {
        name: editionName,
    }));
}

export function useEdition(editionName: string): { edition?: IEdition, error?: Error } {
    const { data, error } = useSWR(getQueryUrlFromParams(apiPaths.editionByName, {
        name: editionName
    }), getEntityOnUrl);
    if (error) {
        // We perform a cast here since the EditionGuard resolves this problem.
        return { error: new Error("Not logged in") };
    }
    return { edition: <IEdition|undefined> data };
}
