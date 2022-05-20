import { Col, Row } from "react-bootstrap";
import SkillBadge from "../../util/skillBadge";
import Image from "next/image";
import { ProjectSkill } from "../../../api/entities/ProjectSkillEntity";

export interface EditProjectSkillSubFormProps {
    skill: ProjectSkill;
    registerRemoval: () => void;
    registerAlteration: (newSkill: ProjectSkill) => void;
}

export default function EditProjectSkillSubForm({ skill, registerRemoval }: EditProjectSkillSubFormProps) {
    return (
        <Row>
            <Col>
                <SkillBadge skill={skill.name} />
            </Col>
            <Col>{": " + skill.additionalInfo}</Col>
            <Col xs={6}>
                <Image
                    onClick={registerRemoval}
                    alt=""
                    src={"/resources/delete.svg"}
                    width="15"
                    height="15"
                />
            </Col>
        </Row>
    )
}