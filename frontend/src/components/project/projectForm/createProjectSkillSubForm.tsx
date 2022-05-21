import { ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import SkillBadge from "../../util/skillBadge";
import Image from "next/image";
import { Field } from "formik";
import { capitalize } from "../../../utility/stringUtil";
import { ChangeEvent, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getAllSkillTypesFromPage } from "../../../api/calls/skillTypeCalls";
import { ISkillType } from "../../../api/entities/SkillTypeEntity";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

/**
 * Properties needed by [CreateProjectSkillSubForm].
 */
export interface CreateProjectSkillSubFormProps {
    createdSkillNames: string[];
    setCreatedSkillNames: (names: string[]) => void;

    createdSkillInfos: string[];
    setCreatedSkillInfos: (infos: string[]) => void;
}

/**
 * Component that allows you to create new projectSkills for a project. It will ask for all needed data.
 * @param createdSkillNames list of names of the newly created projectSkills.
 * @param setCreatedSkillNames callback to set the list of names.
 * @param createdSkillInfos list of info about the newly created projectSkills.
 * @param setCreatedSkillInfos callback to set the list of info.
 */
export default function CreateProjectSkillSubForm({
    createdSkillNames,
    setCreatedSkillNames,
    createdSkillInfos,
    setCreatedSkillInfos,
}: CreateProjectSkillSubFormProps) {
    const { t } = useTranslation("common");

    const { data: receivedSkillTypes, error: skillTypesError } = useSWR(
        apiPaths.skillTypes,
        getAllSkillTypesFromPage
    );

    const skillTypes: ISkillType[] = receivedSkillTypes || [];

    const [selectedSkill, setSelectedSkill] = useState<string>("");
    const [skillInfo, setSkillInfo] = useState<string>("");

    const baseSkill = skillTypes[0]?.name;
    useEffect(() => {
        setSelectedSkill(baseSkill);
    }, [baseSkill]);

    if (skillTypesError) {
        console.log(skillTypesError);
        return null;
    }

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

    return (
        <div>
            {createdSkillInfos.map((skillInfo: string, index: number) => (
                <Row key={index}>
                    <Col>
                        <SkillBadge skill={createdSkillNames[index]} />
                    </Col>
                    <Col>{skillInfo}</Col>
                    <Col xs={6}>
                        <a
                            data-testid={"remove-added-skill-" + createdSkillNames[index]}
                            onClick={() => {
                                setCreatedSkillNames(
                                    createdSkillNames.filter((_, valIndex) => index !== valIndex)
                                );
                                setCreatedSkillInfos(
                                    createdSkillInfos.filter((_, valIndex) => index !== valIndex)
                                );
                            }}
                        >
                            <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                        </a>
                    </Col>
                </Row>
            ))}
            <Dropdown as={ButtonGroup} drop="down">
                <Dropdown.Toggle
                    style={{
                        backgroundColor: "#0a0839",
                        borderColor: "white",
                        height: 30,
                        alignItems: "center",
                        display: "flex",
                    }}
                    data-testid="skill-input"
                >
                    {selectedSkill}
                </Dropdown.Toggle>
                <DropdownMenu>
                    {skillTypes.map((skillType) => (
                        <DropdownItem
                            key={skillType._links.self.href}
                            value={skillType._links.self.href}
                            data-testid={"option-skill-name-" + skillType.name}
                            onClick={() => setSelectedSkill(skillType.name)}
                        >
                            {skillType.name}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
            <input
                className="form-control mb-2"
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
    );
}
