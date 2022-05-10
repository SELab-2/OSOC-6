import { Badge } from "react-bootstrap";
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
    const { data: skillType } = useSkillTypeByName(skill);

    return (
        <Badge bg="" style={{ background: skillType?.colour || "grey" }}>
            {skill}
        </Badge>
    );
}
