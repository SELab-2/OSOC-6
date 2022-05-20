import { Col, Row } from "react-bootstrap";
import SkillBadge from "../../util/skillBadge";
import Image from "next/image";
import { ProjectSkill } from "../../../api/entities/ProjectSkillEntity";
import { ChangeEvent, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../../utility/stringUtil";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getAllSkillTypesFromPage } from "../../../api/calls/skillTypeCalls";
import { ISkillType } from "../../../api/entities/SkillTypeEntity";
import { Field } from "formik";

export interface EditProjectSkillSubFormProps {
    skill: ProjectSkill;
    registerRemoval: () => void;
    registerAlteration: (newSkill: ProjectSkill) => void;
}

export default function EditProjectSkillSubForm({
    skill,
    registerRemoval,
    registerAlteration,
}: EditProjectSkillSubFormProps) {
    const { t } = useTranslation("common");

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [newInfo, setNewInfo] = useState<string>("");

    useEffect(() => {
        setNewInfo(skill.additionalInfo);
    }, [skill.name, skill.additionalInfo]);

    return (
        <Row>
            <Col>
                <SkillBadge skill={skill.name} />
            </Col>
            {!isEditing && <Col>{": " + skill.additionalInfo}</Col>}
            {isEditing && (
                <>
                    <input
                        value={newInfo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setNewInfo(e.target.value)}
                    />
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => {
                            if (skill.additionalInfo !== newInfo) {
                                registerAlteration(new ProjectSkill(skill.name, newInfo, skill.project));
                            }
                            setIsEditing(false);
                        }}
                        data-testid="add-skill-button"
                    >
                        {capitalize(t("apply"))}
                    </button>
                </>
            )}
            <Col xs={6}>
                <Image
                    onClick={registerRemoval}
                    alt=""
                    src={"/resources/delete.svg"}
                    width="15"
                    height="15"
                />
            </Col>
            <Col xs={6}>
                <Image
                    onClick={() => setIsEditing(!isEditing)}
                    alt=""
                    src={"/resources/edit.svg"}
                    width="15"
                    height="15"
                />
            </Col>
        </Row>
    );
}
