import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import { useEffect } from "react";
import { useRouter } from "next/router";
import applicationPaths from "../../properties/applicationPaths";
import { pathIsForbiddenForCoach } from "../../utility/pathUtil";

export default function ForbiddenCoachRoutes({ children }: any): any {
    const isCurrentUserAdmin = useCurrentAdminUser();
    const router = useRouter();
    const path = router.asPath;
    const push = router.push;

    useEffect(() => {
        if (isCurrentUserAdmin !== undefined && !isCurrentUserAdmin) {
            if (pathIsForbiddenForCoach(path)) {
                push("/" + applicationPaths.error).catch(console.log);
            }
        }
    }, [isCurrentUserAdmin, push, path]);

    return children;
}
