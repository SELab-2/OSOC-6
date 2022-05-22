import {Col, Row} from "react-bootstrap";
import SkillBadge from "../../util/skillBadge";
import Image from "next/image";
import {ProjectSkill} from "../../../api/entities/ProjectSkillEntity";
import {ChangeEvent, useState} from "react";
import useTranslation from "next-translate/useTranslation";
import {capitalize} from "../../../utility/stringUtil";
import styles from "../../../styles/projects/createProject.module.css";
import {ConfirmDeleteButton} from "../../util/confirmDeleteButton";

/**
 * Properties needed for [EditProjectSkillSubForm].
 */
export interface EditProjectSkillSubFormProps {
    skill: ProjectSkill;
    registerRemoval: () => void;
    registerAlteration: (newSkill: ProjectSkill) => void;
}

/**
 * Component allowing you to edit existing projectSkills.
 * One should not just remove existing projectskills since this will remove all the assignments.
 * It is however possible to edit the additional info of a projectSKill.
 * We chose not to update the name of a projectSkill.
 * This would change the whole semantic of a projectSkill and make some assignments pointless.
 * @param skill the [ProjectSkill] this form can edit.
 * @param registerRemoval a callback to register this projectSkill as removed.
 * @param registerAlteration a callBack to register an alteration in the projectSKill.
 */
export default function EditProjectSkillSubForm({
    skill,
    registerRemoval,
    registerAlteration,
}: EditProjectSkillSubFormProps) {
    const { t } = useTranslation("common");

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [newInfo, setNewInfo] = useState<string>("");

    function setEditing(isEdit: boolean): void {
        if (isEdit) {
            setNewInfo(skill.additionalInfo);
        }
        setIsEditing(isEdit);
    }

    return (
        <Row style={{ marginTop: "1.5rem" }}>
            <Col className={styles.skillbadge_col}>
                <SkillBadge skill={skill.name} />
            </Col>
            {!isEditing && <Col>{skill.additionalInfo}</Col>}
            {isEditing && (
                <Col>
                    <input
                        className={styles.input_field}
                        value={newInfo}
                        data-testid={"edit-existing-skill-info-" + skill.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewInfo(e.target.value)}
                    />
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                            if (skill.additionalInfo !== newInfo) {
                                registerAlteration(new ProjectSkill(skill.name, newInfo, skill.project));
                            }
                            setEditing(false);
                        }}
                        data-testid={"edit-existing-skill-submit-" + skill.name}
                    >
                        {capitalize(t("apply"))}
                    </button>
                </Col>
            )}
            <Col xs={2}>
                <a
                    style={{ margin: "1rem", cursor: "pointer" }}
                    onClick={() => setEditing(!isEditing)}
                    data-testid={"edit-existing-skill-" + skill.name}
                >
                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                </a>
                <ConfirmDeleteButton dataTestId={"remove-existing-skill-" + skill.name} handler={registerRemoval}/>
            </Col>
        </Row>
    );
}
