import { IUser } from "../entities/UserEntity";
import axios from "axios";
import { AxiosConf } from "./baseCalls";

export async function getUserInfo(url: string): Promise<IUser> {
    return (
        await axios.get(url, {
            ...AxiosConf,
        })
    ).data;
}
