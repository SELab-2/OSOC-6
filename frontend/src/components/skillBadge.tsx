import { Badge } from "react-bootstrap";
import useSWR from "swr";
import useSkillTypeByName from "../hooks/useSkillTypeByName";

/**
 * Parameters to be added to skillBadge
 */
export interface SkillBadgeParams {
    skill: string;
}

/**
 * Create a badge for a given skill
 * @param skill the name of the skill this Badge represents
 */
export default function SkillBadge({ skill }: SkillBadgeParams) {
    const { data: skillType, error } = useSkillTypeByName(skill);

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <Badge bg="" style={{ background: skillType?.colour || "grey" }}>
            {skill}
        </Badge>
    );
}
