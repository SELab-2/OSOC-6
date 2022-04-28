import { useRouter } from "next/router";
import { pathIsAuthException } from "../utility/pathUtil";
import { useEffect } from "react";
import useSWR from "swr";
import { getEditionByName, useEdition } from "../api/calls/editionCalls";

async function assertBaseEdition(editionName: string) {

}

export default function EditionGuard({ children }: any) {
    const router = useRouter();
    const queryParams = router.query as { edition: string | undefined };
    const { edition, error } = useEdition(queryParams.edition || "");

    if (pathIsAuthException(router.asPath)) {
        return children;
    }

    useEffect(assertBaseEdition(), [])

    return children
}