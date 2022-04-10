import { MouseEventHandler } from 'react';
import axios from 'axios';
import pathNames from "../properties/pathNames";
import { Edition, IUser } from "../api/Entities";

const baseRef = { baseURL: pathNames.base };

export const dataInjectionHandler: MouseEventHandler<
    HTMLButtonElement
> = async (_) => {
    const result = await axios.get(pathNames.ownUser, baseRef);
    const user: IUser = <IUser> result.data;

    const own_user: string | undefined = user._links ? user._links.self.href : undefined;

    const editions = (await axios.get(pathNames.editions, baseRef)).data;

    const invitation = (await axios.get(pathNames.invitations, baseRef)).data;

    const edition1: Edition = new Edition("Edition 1", 2022, true);

    //await axios.post(pathNames.editions, edition1, baseRef

    console.log(editions);
};
