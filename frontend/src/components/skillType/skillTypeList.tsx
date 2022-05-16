import { ISkillType, SkillType } from "../../api/entities/SkillTypeEntity";
import { deleteSkillTypeFromList, editSkillTypeColourOnUrl } from "../../api/calls/skillTypeCalls";
import apiPaths from "../../properties/apiPaths";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import { useSWRConfig } from "swr";
import SkillTypeListItem, { EditSkillTypeFields } from "./skillTypeListItem";

export interface SkillTypeListProps {
    skillTypes: ISkillType[];
}

export default function SkillTypeList({ skillTypes }: SkillTypeListProps) {
    const { mutate } = useSWRConfig();


    async function handleDelete(url: string) {
        const newSkillTypes = deleteSkillTypeFromList(url, skillTypes);
        await Promise.all([
            mutate(url, undefined),
            mutate(apiPaths.skillTypes, newSkillTypes),
            mutate(getQueryUrlFromParams(apiPaths.skillTypes, { sort: "name" }), newSkillTypes),
        ]);
    }

    async function handleSkillTypeEdit(url: string, values: EditSkillTypeFields) {
        const newSkillType = await editSkillTypeColourOnUrl(url, values.colour)

        const newSkillTypes = skillTypes.map(skillType =>
            skillType._links.self.href === url ? newSkillType : skillType
        );

        await Promise.all([
            mutate(url, newSkillType),
            mutate(apiPaths.skillTypes, newSkillTypes),
            mutate(getQueryUrlFromParams(apiPaths.skillTypes, { sort: "name" }), newSkillTypes),
        ]);
    }

    return (
        <ul>
            { skillTypes.map(skillType =>
                <SkillTypeListItem
                    skillType={skillType}
                    key={skillType._links.self.href}
                    deleteHandler={handleDelete}
                    editHandler={handleSkillTypeEdit}
                />
            )}
        </ul>
    )
}