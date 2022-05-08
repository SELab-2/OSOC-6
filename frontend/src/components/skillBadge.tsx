import { Badge } from "react-bootstrap";
import useSWR from "swr";
import { getSkillTypeByName } from "../api/calls/skillTypeCalls";

/**
 * Parameters to be added to skillBadge
 */
export interface SkillBadgeParams {
    skill: string;
}

/**
 * Create a badge for a given skill
 * @param skill
 * @constructor
 */
export default function SkillBadge({ skill }: SkillBadgeParams) {
    const { data: skillType, error } = useSWR(skill, getSkillTypeByName);

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
