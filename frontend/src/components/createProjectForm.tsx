import useTranslation from "next-translate/useTranslation";
import { Button, Form, FormCheck, ListGroup } from "react-bootstrap";
import styles from "../styles/loginForm.module.css";
import { Field, Formik } from "formik";
import { Simulate } from "react-dom/test-utils";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { getAllUsersFromPage } from "../api/calls/userCalls";
import { capitalize } from "../utility/stringUtil";
import { ProjectCreationProps } from "../handlers/createProjectSubmitHandler";

export const CreateProjectForm = (props: ProjectCreationProps) => {
    const { t } = useTranslation("common");
    let { data, error } = useSWR(apiPaths.users, getAllUsersFromPage);
    data = data || [];

    if (error) {
        console.log(error);
        return null;
    }

    //data = data.filter((user: IUser) => user.userRole === "COACH")
    console.log("DATA");
    console.log(data);

    return (
        <div className={styles.login_box}>
            <Formik
                initialValues={{
                    projectName: "",
                    versionManagement: "",
                    coach: "",
                    partnerName: "",
                    partnerWebsite: "",
                }}
                onSubmit={() => {
                    console.log("SUBMITTED");
                    props.submitHandler;
                }}
                //onSubmit={() => console.log("amettn")}
            >
                <Form>
                    <h2>Create new project</h2>
                    <Field
                        label={capitalize(t("choose project name"))}
                        name="projectName"
                        placeholder={capitalize(t("project name placeholder"))}
                        required
                    />
                    <Field
                        label={capitalize(t("choose version control URL"))}
                        name="versionManagement"
                        placeholder={capitalize(t("version control placeholder"))}
                        required
                    />
                    <Field
                        label={capitalize(t("choose coach"))}
                        as="select"
                        name="coach"
                        placeholder={capitalize(t("choose coach"))}
                        required
                    >
                        {data.map((user) => (
                            <option key={user.callName} value={user.callName} label={user.callName}>
                                {user.callName}
                            </option>
                        ))}
                    </Field>
                    <Field
                        label={capitalize(t("choose partner name"))}
                        name="partnerName"
                        placeholder={capitalize(t("partner name placeholder"))}
                        required
                    />
                    <Field
                        label={capitalize(t("choose partner website"))}
                        name="partnerWebsite"
                        placeholder={capitalize(t("partner website placeholder"))}
                        required
                    />
                    <button className="btn btn-primary" type="submit">
                        Create project
                    </button>
                </Form>
            </Formik>
        </div>
    );
};
