import applicationPaths from "../../properties/applicationPaths";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { pathIsAuthException } from "../../utility/pathUtil";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useRouterReplace } from "../../hooks/routerHooks";

export default function RouteGuard({ children }: any) {
    const router = useRouter();
    const routerPath = router.asPath;
    const routerAction = useRouterReplace();

    const [authorized, setAuthorized] = useState<boolean>(false);

    const { error: userError } = useCurrentUser(true);
    const userErrorMsg = userError?.message;

    useEffect(() => {
        // Check the authentication of the current path
        const authException = pathIsAuthException(routerPath);

        if (!authException && userErrorMsg) {
            routerAction({
                pathname: "/" + applicationPaths.login,
                query: { returnUrl: routerPath },
            }).catch(console.log);
        }

        setAuthorized(authException || !userErrorMsg);
    }, [routerPath, userErrorMsg, routerAction]);

    return authorized && children;
}
