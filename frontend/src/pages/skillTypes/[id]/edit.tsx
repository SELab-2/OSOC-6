import SkillTypeForm from "../../../components/skillType/skillTypeForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getSkillTypeOnUrl } from "../../../api/calls/skillTypeCalls";
import { emptySkillType } from "../../../api/entities/SkillTypeEntity";

export default function EditSkillTypePage() {
    const router = useRouter();
    const query = router.query as { id: string };
    const skillTypeId = query.id;

    const { data: receivedSkillType, error: skillTypeError } = useSWR(
        apiPaths.skillTypes + "/" + skillTypeId,
        getSkillTypeOnUrl
    );

    if (skillTypeError) {
        console.log(skillTypeError);
        return null;
    }

    const skillType = receivedSkillType || emptySkillType;

    return null;
}
