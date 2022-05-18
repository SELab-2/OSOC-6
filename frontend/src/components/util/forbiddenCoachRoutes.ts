import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserRole } from "../../api/entities/UserEntity";
import applicationPaths from "../../properties/applicationPaths";
import { pathIsAllowedForCoach } from "../../utility/pathUtil";

export default function ForbiddenCoachRoutes({ children }: any): any {
    const { user: user } = useCurrentUser(true);
    const router = useRouter();

    useEffect(() => {
        if (user?.userRole !== UserRole.admin) {
            if (!pathIsAllowedForCoach(router.asPath)) {
                router.push("/" + applicationPaths.error).catch(console.log);
            }
        }
    }, [user?.userRole, router]);

    return children;
}
