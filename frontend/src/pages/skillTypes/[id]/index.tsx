import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getSkillTypeOnUrl } from "../../../api/calls/skillTypeCalls";
import { emptySkillType } from "../../../api/entities/SkillTypeEntity";
import { Badge } from "react-bootstrap";

export default function SkillTypeIndexPage() {
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

    return (
        <Badge bg="" style={{ background: skillType.colour }}>
            {skillType.name}
        </Badge>
    );
}
