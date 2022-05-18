import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getAllSkillTypesFromPage } from "../../api/calls/skillTypeCalls";
import { ISkillType } from "../../api/entities/SkillTypeEntity";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import SkillTypeList from "../../components/skillType/skillTypeList";

export default function SkillTypeIndexPage() {
    const { data: receiveSkillTypes, error: skillTypesError } = useSWR(
        getQueryUrlFromParams(apiPaths.skillTypes, { sort: "name" }),
        getAllSkillTypesFromPage
    );

    if (skillTypesError) {
        console.log(skillTypesError);
        return null;
    }

    const skillTypes: ISkillType[] = receiveSkillTypes || [];

    return <SkillTypeList skillTypes={skillTypes} />;
}
