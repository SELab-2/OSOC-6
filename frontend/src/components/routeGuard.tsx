import applicationPaths from "../properties/applicationPaths";
import { useCurrentUser } from "../api/calls/userCalls";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pathIsAuthException } from "../utility/pathUtil";



export default function RouteGuard({ children }: any) {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const { replace } = useRouter();

    const { error } = useCurrentUser();
    const errorMsg = error?.name;

    useEffect(() => {
        // Check the authentication of the current path
        const authException = pathIsAuthException(Router.asPath);

        if (!authException && errorMsg) {
            const pushed = replace({
                pathname: applicationPaths.login,
                query: { returnUrl: Router.asPath },
            });
        }
        setAuthorized(authException || !errorMsg);
    }, [errorMsg]);

    return authorized && children;
}
