import applicationPaths from "../properties/applicationPaths";
import { useCurrentUser } from "../api/calls/userCalls";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pathIsAuthException } from "../utility/pathUtil";
import { getAllEditionsFromPage } from "../api/calls/editionCalls";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";
import apiPaths from "../properties/apiPaths";
import useEdition from "../hooks/useGlobalEdition";

export default function RouteGuard({ children }: any) {
    const router = useRouter();

    const [authorized, setAuthorized] = useState<boolean>(false);

    const { error: userError } = useCurrentUser(true);
    const userErrorMsg = userError?.message;

    const [cachedEditionName, setCachedEditionName] = useEdition();

    const routerPath = router.asPath;
    const curEditionName = (router.query as { edition?: string }).edition;

    const { data: availableEditions } = useSWR(
        !cachedEditionName ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" }) : null,
        getAllEditionsFromPage
    );
    const latestEdition = availableEditions?.at(0);
    const latestEditionName = latestEdition?.name;

    useEffect(() => {
        // Check the authentication of the current path
        const authException = pathIsAuthException(routerPath);

        if (curEditionName && cachedEditionName !== curEditionName) {
            setCachedEditionName(curEditionName);
        }

        if (!authException && userErrorMsg) {
            Router.replace({
                pathname: applicationPaths.login,
                query: { returnUrl: routerPath },
            }).catch(console.log);
        }

        if (cachedEditionName && !curEditionName) {
            Router.replace({
                query: { edition: cachedEditionName },
            }).catch(console.log);
        }

        if (!cachedEditionName && !curEditionName && latestEditionName) {
            Router.replace({
                query: {
                    edition: latestEditionName,
                },
            }).catch(console.log);
        }

        setAuthorized(authException || (!userErrorMsg && !!curEditionName));
    }, [
        routerPath,
        userErrorMsg,
        curEditionName,
        cachedEditionName,
        latestEditionName,
        setCachedEditionName,
    ]);

    if (availableEditions && availableEditions.length === 0) {
        if (router.pathname !== "/" + applicationPaths.home) {
            return <div>No edition</div>;
        } else {
            return children;
        }
    }

    return authorized && children;
}
