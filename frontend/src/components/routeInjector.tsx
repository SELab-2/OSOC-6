import useEdition from "../hooks/useGlobalEdition";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";
import apiPaths from "../properties/apiPaths";
import { getAllEditionsFromPage, getEditionByName } from "../api/calls/editionCalls";
import { useEffect } from "react";
import applicationPaths from "../properties/applicationPaths";
import useTranslation from "next-translate/useTranslation";

export default function RouteInjector({ children }: any) {
    const { t } = useTranslation("common");
    const [cachedEdition, setCachedEdition] = useEdition();

    const router = useRouter();
    const replace = router.replace;
    const query = router.query as { edition?: string };
    const curEditionName = query.edition;
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
            replace({
                query: { ...query, edition: cachedEdition.name },
            }).catch(console.log);
        }

        if (!cachedEdition && !curEditionName && latestEditionName) {
            replace({
                query: {
                    ...query,
                    edition: latestEditionName,
                },
            }).catch(console.log);
        }
    }, [replace, query, curEdition, curEditionName, cachedEdition, latestEditionName, setCachedEdition]);

    if (availableEditions && availableEditions.length === 0) {
        if (router.pathname !== "/" + applicationPaths.home) {
            return <div>{t("no edition")}</div>;
        } else {
            return children;
        }
    }

    return children;
}
