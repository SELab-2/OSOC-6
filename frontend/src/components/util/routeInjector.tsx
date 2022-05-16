import useEdition from "../../hooks/useGlobalEdition";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import apiPaths from "../../properties/apiPaths";
import { getAllEditionsFromPage, getEditionByName } from "../../api/calls/editionCalls";
import { useEffect } from "react";
import applicationPaths from "../../properties/applicationPaths";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { Button } from "react-bootstrap";
import NavBar from "./navBar";

export default function RouteInjector({ children }: any) {
    const { t } = useTranslation("common");
    const [contextEdition, setContextEdition] = useEdition();

    const router = useRouter();
    const replace = router.replace;
    const query = router.query as { edition?: string };
    const routerEditionName = query.edition;
    const fetchedRouterEdition = useSWR(
        !contextEdition && routerEditionName ? routerEditionName : null,
        getEditionByName
    ).data;

    const { data: availableEditions } = useSWR(
        !contextEdition && !routerEditionName
            ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" })
            : null,
        getAllEditionsFromPage
    );
    const latestEdition = availableEditions?.at(availableEditions?.length - 1);
    const latestEditionName = latestEdition?.name;

    useEffect(() => {
        if (fetchedRouterEdition && contextEdition?.name !== fetchedRouterEdition.name) {
            setContextEdition(fetchedRouterEdition);
        }

        if (contextEdition && !routerEditionName) {
            replace({
                query: { ...query, edition: contextEdition.name },
            }).catch(console.log);
        }

        //
        // if (!contextEdition && !routerEditionName && latestEditionName) {
        //     replace({
        //         query: {
        //             ...query,
        //             edition: latestEditionName,
        //         },
        //     }).catch(console.log);
        // }
    }, [
        replace,
        query,
        fetchedRouterEdition,
        routerEditionName,
        contextEdition,
        latestEditionName,
        setContextEdition,
    ]);

    if (availableEditions && availableEditions.length === 0) {
        if (
            router.pathname !== "/" + applicationPaths.home &&
            router.pathname !== "/" + applicationPaths.editionCreate
        ) {
            return (
                <>
                    <NavBar />
                    <div style={{ textAlign: "center", padding: "15em 0" }}>
                        <div style={{ padding: "10px", fontWeight: "bold", fontSize: "130%" }}>
                            {capitalize(t("no edition"))}
                        </div>
                        <Button href={applicationPaths.editionCreate}>
                            {capitalize(t("create new edition"))}
                        </Button>
                    </div>
                </>
            );
        } else {
            return children;
        }
    }

    return children;
}
