import { Col, Row } from "react-bootstrap";
import SkillBadge from "../../util/skillBadge";
import Image from "next/image";
import { Field } from "formik";
import { capitalize } from "../../../utility/stringUtil";
import { ChangeEvent, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getAllSkillTypesFromPage } from "../../../api/calls/skillTypeCalls";
import { ISkillType } from "../../../api/entities/SkillTypeEntity";

export interface CreateProjectSkillSubFormProps {
    createdSkillNames: string[]
    setCreatedSkillNames: (names: string[]) => void;

    createdSkillInfos: string[];
    setCreatedSkillInfos: (infos: string[]) => void;
}

export default function CreateProjectSkillSubForm({ createdSkillNames, setCreatedSkillNames, createdSkillInfos, setCreatedSkillInfos }: CreateProjectSkillSubFormProps) {
    const { t } = useTranslation("common");

    const { data: receivedSkillTypes, error: skillTypesError } = useSWR(
        apiPaths.skillTypes,
        getAllSkillTypesFromPage
    );

    const skillTypes: ISkillType[] = receivedSkillTypes || [];

    const [selectedSkill, setSelectedSkill] = useState<string>("");
    const [skillInfo, setSkillInfo] = useState<string>("");

    function handleAddCreatedSkill() {
        if (!selectedSkill) {
            setSelectedSkill(skillTypes[0].name);
        }

        const newSkill: string = !selectedSkill ? skillTypes[0].name : selectedSkill;
        const newSkills: string[] = createdSkillNames.concat(newSkill);

        const newSkillInfo: string = !skillInfo ? capitalize(t("skill info")) : skillInfo;

        setCreatedSkillNames(newSkills);
        setCreatedSkillInfos([...createdSkillInfos, newSkillInfo]);
        setSkillInfo("");
    }

    function initialize() {
        setSelectedSkill(skillTypes[0].name);
    }

    return (
        <div onLoad={initialize}>
            {createdSkillInfos.map((skillInfo: string, index: number) => (
                <Row key={index}>
                    <Col>
                        <SkillBadge skill={createdSkillNames[index]} />
                    </Col>
                    <Col>{": " + skillInfo}</Col>
                    <Col xs={6}>
                        <Image
                            onClick={() => {
                                setCreatedSkillNames(
                                    createdSkillNames.filter((_, valIndex) => index !== valIndex)
                                );
                                setCreatedSkillInfos(
                                    createdSkillInfos.filter((_, valIndex) => index !== valIndex)
                                );
                            }}
                            alt=""
                            src={"/resources/delete.svg"}
                            width="15"
                            height="15"
                        />
                    </Col>
                </Row>
            ))}
            <Field
                className="form-control mb-2"
                label={capitalize(t("skill type"))}
                as="select"
                name="skillType"
                data-testid="skill-input"
                value={selectedSkill}
                placeholder={capitalize(t("skill type"))}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedSkill(e.target.value)}
            >
                {skillTypes.map((skillType) => (
                    <option
                        key={skillType.name}
                        value={skillType.name}
                        label={skillType.name}
                        data-testid={"skilltype-" + skillType.name}
                    >
                        {skillType.name}
                    </option>
                ))}
            </Field>
            <Field
                className="form-control mb-2"
                label={capitalize(t("extra skill info"))}
                name="skillInfo"
                data-testid="skillinfo-input"
                value={skillInfo}
                placeholder={capitalize(t("extra skill info placeholder"))}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSkillInfo(e.target.value)}
            />
            <button
                className="btn btn-secondary"
                type="button"
                onClick={handleAddCreatedSkill}
                data-testid="add-skill-button"
            >
                {capitalize(t("add skill"))}
            </button>
        </div>
    )
}