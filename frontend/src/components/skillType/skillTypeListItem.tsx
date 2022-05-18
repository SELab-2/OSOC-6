import { ISkillType } from "../../api/entities/SkillTypeEntity";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import { Badge } from "react-bootstrap";
import { capitalize } from "../../utility/stringUtil";

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
        <li>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (values: EditSkillTypeFields) => {
                    setEditing(false);
                    await editHandler(selfUrl, values);
                }}
            >
                {({ values }) => (
                    <Form>
                        <div>
                            <Badge bg="" style={{ background: values.colour }}>
                                {skillType.name}
                            </Badge>
                        </div>
                        <div>
                            <button
                                data-testid="start-edit"
                                type="button"
                                onClick={() => setEditing(!editing)}
                            >
                                {capitalize(t("edit colour"))}
                            </button>
                        </div>

                        {editing && (
                            <div>
                                <div>
                                    <label htmlFor="colour" className="form-label">
                                        {capitalize(t("color representing skill type"))}
                                    </label>
                                    <Field
                                        type="color"
                                        className="form-control form-control-color"
                                        id="skillTypeColour"
                                        data-testid="colour"
                                        name="colour"
                                        title={capitalize(t("color representing skill type"))}
                                    />
                                </div>
                                <button className="capitalize" data-testid="submit-edit" type="submit">
                                    {t("confirm")}
                                </button>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
            <button data-testid="delete" onClick={() => deleteHandler(selfUrl)}>
                {capitalize(t("delete"))}
            </button>
        </li>
    );
}