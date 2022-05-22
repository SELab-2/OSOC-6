import { IUser, UserRole } from "../api/entities/UserEntity";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { CommonSWRConfig } from "./shared";
import { getUserOnUrl } from "../api/calls/userCalls";

/**
 * Hook returning the user that is currently logged in.
 * @param shouldExec boolean that should be true if you want the hook to actually fetch the user. (defaults to true)
 * @param config [CommonSWRConfig] config that allows to set shared SWR configurations.
 */
export function useCurrentUser(
    shouldExec: boolean = true,
    config?: CommonSWRConfig
): { user?: IUser; error?: Error } {
    const { data, error } = useSWR(shouldExec ? apiPaths.ownUser : null, getUserOnUrl, config);
    if (error) {
        return { error: new Error("Not logged in") };
    }
    return { user: data };
}

/**
 * Hook returning if the current user is an admin or not.
 */
export function useCurrentAdminUser(): undefined | boolean {
    const { user: user } = useCurrentUser();
    return user === undefined ? undefined : user.userRole === UserRole.admin;
}
