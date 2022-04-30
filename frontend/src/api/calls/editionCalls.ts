import { getAllEntitiesFromPage, getEntityOnUrl, getQueryUrlFromParams } from "./baseCalls";
import { editionCollectionName, IEdition } from "../entities/EditionEntity";
import apiPaths from "../../properties/apiPaths";
import useSWR from "swr";
import { useRouter } from "next/router";

export function getAllEditionsFromPage(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromPage(url, editionCollectionName);
}

export function getEditionByName(editionName: string): Promise<IEdition> {
    return <Promise<IEdition>>getEntityOnUrl(
        getQueryUrlFromParams(apiPaths.editionByName, {
            name: editionName,
        })
    );
}

export function useEdition(editionName: string | undefined): IEdition | undefined {
    const { data } = useSWR(
        editionName
            ? getQueryUrlFromParams(apiPaths.editionByName, {
                  name: editionName,
              })
            : null,
        getEntityOnUrl
    );
    return <IEdition | undefined>data;
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

    if (!queryParams.edition && !isValidating) {
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
