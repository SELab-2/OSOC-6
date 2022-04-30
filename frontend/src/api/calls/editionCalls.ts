import { getAllEntitiesFromPage, getEntityOnUrl, getQueryUrlFromParams } from "./baseCalls";
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

export function useCurrentEdition(shouldExec: boolean): IEdition | undefined {
    const router = useRouter();
    const queryParams = router.query as { edition: string | undefined };
    const chosenEdition = useEdition(queryParams.edition);

    const { data, isValidating } = useSWR(
        shouldExec && !chosenEdition ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" }) : null,
        getAllEditionsFromPage
    );
    const newestEdition = data?.at(0);

    if (shouldExec && !queryParams.edition && !isValidating) {
        router
            .replace({
                query: {
                    edition: newestEdition?.name,
                },
            })
            .catch(console.log);
    }

    return chosenEdition || newestEdition;
}

export function extractIdFromEditionUrl(url: string): number {
    return 3;
}
