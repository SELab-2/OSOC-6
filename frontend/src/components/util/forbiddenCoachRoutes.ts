import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import { useEffect } from "react";
import { useRouter } from "next/router";
import applicationPaths from "../../properties/applicationPaths";
import { pathIsForbiddenForCoach } from "../../utility/pathUtil";
import { useRouterPush } from "../../hooks/routerHooks";

export default function ForbiddenCoachRoutes({ children }: any): any {
    const isCurrentUserAdmin = useCurrentAdminUser();
    const router = useRouter();
    const path = router.asPath;
    const routerAction = useRouterPush();

    useEffect(() => {
        if (isCurrentUserAdmin !== undefined && !isCurrentUserAdmin) {
            if (pathIsForbiddenForCoach(path)) {
                routerAction("/" + applicationPaths.error).catch(console.log);
            }
        }
    }, [isCurrentUserAdmin, routerAction, path]);

    return children;
}
