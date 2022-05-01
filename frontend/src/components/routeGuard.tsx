import applicationPaths from "../properties/applicationPaths";
import { useCurrentUser } from "../api/calls/userCalls";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pathIsAuthException } from "../utility/pathUtil";

export default function RouteGuard({ children }: any) {
    const router = useRouter();
    const routerPath = router.asPath;

    const [authorized, setAuthorized] = useState<boolean>(false);

    const { error: userError } = useCurrentUser(true);
    const userErrorMsg = userError?.message;

    useEffect(() => {
        // Check the authentication of the current path
        const authException = pathIsAuthException(routerPath);

        if (!authException && userErrorMsg) {
            Router.replace({
                pathname: applicationPaths.login,
                query: { returnUrl: routerPath },
            }).catch(console.log);
        }

        setAuthorized(authException || !userErrorMsg);
    }, [routerPath, userErrorMsg]);

    return authorized && children;
}
