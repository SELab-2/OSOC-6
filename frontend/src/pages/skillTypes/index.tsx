import apiPaths from "../../properties/apiPaths";
import { getAllSkillTypesFromPage } from "../../api/calls/skillTypeCalls";
import { ISkillType } from "../../api/entities/SkillTypeEntity";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import SkillTypeList from "../../components/skillType/skillTypeList";
import { useSwrForEntityList } from "../../hooks/utilHooks";

export default function SkillTypeIndexPage() {
    const { data: receiveSkillTypes, error: skillTypesError } = useSwrForEntityList(
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
