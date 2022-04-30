import applicationPaths from "../properties/applicationPaths";
import { useCurrentUser } from "../api/calls/userCalls";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pathIsAuthException } from "../utility/pathUtil";
import { useCurrentEdition } from "../api/calls/editionCalls";
import { IEdition } from "../api/entities/EditionEntity";

export default function RouteGuard({ children }: any) {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [edition, setEdition] = useState<IEdition | undefined>(undefined);
    const { replace } = useRouter();

    const { error } = useCurrentUser(true);
    const errorMsg = error?.name;

    const curEdition = useCurrentEdition(!errorMsg);
    const curEditionName = curEdition?.name;

    if (curEdition && edition?._links.self.href !== curEdition._links.self.href) {
        setEdition(curEdition);
    }

    useEffect(() => {
        // Check the authentication of the current path
        const authException = pathIsAuthException(Router.asPath);

        if (!authException && errorMsg) {
            replace({
                pathname: applicationPaths.login,
                query: { returnUrl: Router.asPath },
            }).catch(console.log);
        }

        if (!curEdition && curEditionName) {
            replace({
                query: { edition: curEditionName },
            }).catch(console.log);
        }

        setAuthorized(authException || (!errorMsg && !!curEditionName));
    }, [errorMsg, curEditionName]);

    return authorized && children;
}
