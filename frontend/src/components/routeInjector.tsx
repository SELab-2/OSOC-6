import useEdition from "../hooks/useGlobalEdition";
import Router, { useRouter } from "next/router";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";
import apiPaths from "../properties/apiPaths";
import { getAllEditionsFromPage, getEditionByName } from "../api/calls/editionCalls";
import { useEffect } from "react";
import applicationPaths from "../properties/applicationPaths";

export default function RouteInjector({ children }: any) {
    const [cachedEdition, setCachedEdition] = useEdition();

    const router = useRouter();
    const curEditionName = (router.query as { edition?: string }).edition;
    const curEdition = useSWR(
        !cachedEdition && curEditionName ? curEditionName : null,
        getEditionByName
    ).data;

    const { data: availableEditions } = useSWR(
        !cachedEdition && !curEditionName ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" }) : null,
        getAllEditionsFromPage
    );
    const latestEdition = availableEditions?.at(0);
    const latestEditionName = latestEdition?.name;

    useEffect(() => {
        if (curEdition && cachedEdition?.name !== curEdition.name) {
            setCachedEdition(curEdition);
        }

        if (cachedEdition && !curEditionName) {
            Router.replace({
                query: { ...Router.query, edition: cachedEdition.name },
            }).catch(console.log);
        }

        if (!cachedEdition && !curEditionName && latestEditionName) {
            Router.replace({
                query: {
                    ...Router.query,
                    edition: latestEditionName,
                },
            }).catch(console.log);
        }
    }, [curEdition, curEditionName, cachedEdition, latestEditionName, setCachedEdition]);

    if (availableEditions && availableEditions.length === 0) {
        if (router.pathname !== "/" + applicationPaths.home) {
            return <div>No edition</div>;
        } else {
            return children;
        }
    }

    return children;
}
