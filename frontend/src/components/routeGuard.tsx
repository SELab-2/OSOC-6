import applicationPaths from "../properties/applicationPaths";
import { useCurrentUser } from "../api/calls/userCalls";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pathIsAuthException } from "../utility/pathUtil";
import { getAllEditionsFromPage, useCurrentEdition } from "../api/calls/editionCalls";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";
import apiPaths from "../properties/apiPaths";

export default function RouteGuard({ children }: any) {
    const router = useRouter();

    const [authorized, setAuthorized] = useState<boolean>(false);

    const { error: userError } = useCurrentUser(true);
    const userErrorMsg = userError?.message;

    const curEdition = useCurrentEdition();
    const curEditionName = curEdition?.name;

    const { data: availableEditions } = useSWR(
        !curEditionName ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" }) : null,
        getAllEditionsFromPage
    );
    const latestEdition = availableEditions?.at(0);
    const latestEditionName = latestEdition?.name;

    let cachedEditionName: string | undefined;
    try {
        cachedEditionName = localStorage?.getItem("edition") || undefined;
    } catch (e: any) {
        // CachedEdition is not yet defined here
    }

    if (curEdition && cachedEditionName !== curEditionName) {
        console.log("edition is set");
        localStorage.setItem("edition", curEdition.name);
    }

    // console.log(cachedEditionName);
    // console.log(userErrorMsg)
    // console.log(curEdition)
    // console.log(latestEditionName)

    useEffect(() => {
        // Check the authentication of the current path
        const authException = pathIsAuthException(router.asPath);

        if (!authException && userErrorMsg) {
            router
                .replace({
                    pathname: applicationPaths.login,
                    query: { returnUrl: router.asPath },
                })
                .catch(console.log);
        }

        if (cachedEditionName && !router.query.edition) {
            router
                .replace({
                    query: { edition: cachedEditionName },
                })
                .catch(console.log);
        }

        if (!cachedEditionName && !curEditionName && latestEditionName) {
            router
                .replace({
                    query: {
                        edition: latestEditionName,
                    },
                })
                .catch(console.log);
        }

        setAuthorized(authException || (!userErrorMsg && !!curEditionName));
    }, [router.asPath, userErrorMsg, curEditionName, cachedEditionName, latestEditionName]);

    if (availableEditions && availableEditions.length === 0) {
        if (router.pathname !== "/" + applicationPaths.home) {
            return <div>No edition</div>;
        } else {
            return children;
        }
    }

    return authorized && children;
}
