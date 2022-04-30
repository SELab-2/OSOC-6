import { getAllEntitiesFromPage, getQueryUrlFromParams } from "./baseCalls";
import { editionCollectionName, IEdition } from "../entities/EditionEntity";
import apiPaths from "../../properties/apiPaths";
import useSWR from "swr";
import { useRouter } from "next/router";

export function getAllEditionsFromPage(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromPage(url, editionCollectionName);
}

export async function getEditionByName(editionName: string): Promise<IEdition | undefined> {
    const editions = await getAllEditionsFromPage(
        getQueryUrlFromParams(apiPaths.editionByName, {
            name: editionName,
        })
    );
    return editions[0];
}

export function useEdition(editionName: string | undefined): IEdition | undefined {
    return useSWR(editionName ? editionName : null, getEditionByName).data;
}

export function useCurrentEdition(): IEdition | undefined {
    const router = useRouter();
    const queryParams = router.query as { edition: string | undefined };
    return useEdition(queryParams.edition);
}

export function extractIdFromEditionUrl(url: string): number {
    return 3;
}

export function withEditionQuery(url: string): string {
    return getQueryUrlFromParams(url, { edition: localStorage.getItem("edition") });
}
