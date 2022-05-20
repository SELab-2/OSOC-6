import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import { useEffect } from "react";
import { useRouter } from "next/router";
import applicationPaths from "../../properties/applicationPaths";
import { pathIsForbiddenForCoach } from "../../utility/pathUtil";

export default function ForbiddenCoachRoutes({ children }: any): any {
    const isCurrentUserAdmin = useCurrentAdminUser();
    const router = useRouter();

    useEffect(() => {
        if (isCurrentUserAdmin !== undefined && !isCurrentUserAdmin) {
            if (pathIsForbiddenForCoach(router.asPath)) {
                router.push("/" + applicationPaths.error).catch(console.log);
            }
        }
    }, [isCurrentUserAdmin, router]);

    return children;
}
