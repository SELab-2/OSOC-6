import { IUser, UserRole } from "../entities/UserEntity";
import axios from "axios";
import { AxiosConf } from "./baseCalls";

export async function getUserInfo(url: string): Promise<IUser> {
    return (
        await axios.get(url, {
            ...AxiosConf,
        })
    ).data;
}

export function getEmtpyUser(): IUser {
    return {
        accountNonExpired: true,
        accountNonLocked: true,
        authorities: { authority: UserRole.coach },
        callName: "",
        credentialsNonExpired: true,
        email: "",
        enabled: true,
        userRole: UserRole.coach,
        username: "",

        _links: {
            communications: { href: "" },
            projects: { href: "" },
            receivedInvitations: { href: "" },
            skills: { href: "" },
            userEntity: { href: "" },
            self: { href: "" },
        },
    };
}
