import { IUser } from "../api/entities/UserEntity";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { CommonSWRConfig } from "./shared";
import { getUserOnUrl } from "../api/calls/userCalls";

export function useCurrentUser(
    shouldExec: boolean,
    config?: CommonSWRConfig
): { user?: IUser; error?: Error } {
    const { data, error } = useSWR(shouldExec ? apiPaths.ownUser : null, getUserOnUrl, config);
    if (error) {
        return { error: new Error("Not logged in") };
    }
    return { user: data };
}
