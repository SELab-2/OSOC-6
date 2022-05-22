import { ISkillType } from "../../api/entities/SkillTypeEntity";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { Badge } from "react-bootstrap";
import { capitalize } from "../../utility/stringUtil";
import styles from "../../styles/skillTypes.module.css";
import Image from "next/image";
import { ConfirmDeleteButton } from "../util/confirmDeleteButton";

export interface SkillTypeListItemProps {
    skillType: ISkillType;
    deleteHandler: (url: string) => Promise<void>;
    editHandler: (url: string, editFields: EditSkillTypeFields) => Promise<void>;
}

export interface EditSkillTypeFields {
    colour: string;
}

export default function SkillTypeListItem({ skillType, deleteHandler, editHandler }: SkillTypeListItemProps) {
    const { t } = useTranslation("common");
    const [editing, setEditing] = useState<boolean>(false);
    const selfUrl: string = skillType._links.self.href;

    const initialValues: EditSkillTypeFields = {
        colour: skillType.colour,
    };

    return (
        <li className={"list-group-item " + styles.bg_color}>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (values: EditSkillTypeFields) => {
                    setEditing(false);
                    await editHandler(selfUrl, values);
                }}
            >
                {({ values }) => (
                    <Form className="row">
                        <div className="col">
                            <Badge bg="" style={{ background: values.colour }}>
                                {skillType.name}
                            </Badge>
                        </div>
                        {editing && (
                            <div className="col d-flex">
                                <Field
                                    type="color"
                                    className={"form-control form-control-color " +  styles.input_field}
                                    id="skillTypeColour"
                                    data-testid="colour"
                                    name="colour"
                                    title={capitalize(t("color representing skill type"))}
                                />
                                <button
                                    className="btn btn-primary ms-2"
                                    data-testid="submit-edit"
                                    type="submit"
                                >
                                    {capitalize(t("confirm"))}
                                </button>
                            </div>
                        )}
                        <div className="col-auto">
                            <a
                                className="clickable col"
                                onClick={() => setEditing(!editing)}
                                data-testid="start-edit"
                                title={capitalize(t("edit colour"))}
                            >
                                <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                            </a>
                        </div>
                        <div className="col-auto">
                            <ConfirmDeleteButton
                                dataTestId="delete-item"
                                handler={() => deleteHandler(selfUrl)}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </li>
    );
}
