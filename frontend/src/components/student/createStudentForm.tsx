import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { useSWRConfig } from "swr";
import {
    emptyStudent,
    EnglishProficiency,
    englishProficiencyAsString,
    Gender,
    genderAsString,
    IStudent,
    OsocExperience,
    osocExperienceAsString,
    Student,
    studentFromIStudent,
} from "../../api/entities/StudentEntity";
import useEdition from "../../hooks/useGlobalEdition";
import { createStudentSubmitHandler } from "../../handlers/createStudentSubmitHandler";
import ItemListForm from "../util/itemListForm";
import styles from "../../styles/students/studentCreate.module.css";
import { useRouterPush } from "../../hooks/routerHooks";

/**
 * Props needed for the create student form.
 */
export interface CreateStudentFormProps {
    student?: IStudent;
}

/**
 * Form allowing the creation of a new communication template.
 */
export default function CreateStudentForm({ student }: CreateStudentFormProps) {
    const { t } = useTranslation("common");
    const routerAction = useRouterPush();
    const { mutate } = useSWRConfig();
    const [editionUrl] = useEdition();

    const initialValues: Student = studentFromIStudent(editionUrl!, student ? student : emptyStudent);

    return (
        <div
            className={styles.student_outer_div + " container"}
            data-testid="student-create-form"
            style={{ marginLeft: "30rem", marginTop: "1rem" }}
        >
            <div className={styles.student_inner_div}>
                <h2>{student ? capitalize(t("edit student")) : capitalize(t("create student"))}</h2>
                <hr />
            </div>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={(values) =>
                    createStudentSubmitHandler(
                        student ? student._links.self.href : null,
                        values,
                        routerAction,
                        mutate
                    )
                }
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="callNameField" className="form-label">
                                {capitalize(t("callname")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="callName"
                                required
                                value={values.callName}
                                placeholder={capitalize(t("callname"))}
                                id="callNameField"
                                data-testid="callName"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="firstNameField" className="form-label">
                                {capitalize(t("first name")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="firstName"
                                required
                                placeholder={capitalize(t("first name"))}
                                id="firstNameField"
                                data-testid="firstName"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="lastNameField" className="form-label">
                                {capitalize(t("last name")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="lastName"
                                required
                                placeholder={capitalize(t("last name"))}
                                id="lastNameField"
                                data-testid="lastName"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="emailField" className="form-label">
                                {capitalize(t("email")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="email"
                                required
                                placeholder={capitalize(t("email"))}
                                id="emailField"
                                data-testid="email"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="phoneNumberField" className="form-label">
                                {capitalize(t("phone number")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="phoneNumber"
                                required
                                placeholder={capitalize(t("phone number"))}
                                id="phoneNumberField"
                                data-testid="phoneNumber"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="genderField" className="form-label">
                                {capitalize(t("gender")) + ":"}
                            </label>
                            <Field
                                id="genderField"
                                as="select"
                                name="gender"
                                data-testid="gender"
                                className={styles.input_field + " " + styles.dropdown_field + " form-select"}
                            >
                                {Object.keys(Gender).map((gender) => {
                                    const genderEnum = Gender[gender as keyof typeof Gender];
                                    return (
                                        <option
                                            key={gender}
                                            value={genderEnum}
                                            label={capitalize(t(genderAsString[genderEnum]))}
                                            data-testid={"gender-" + gender}
                                        >
                                            {capitalize(t(genderAsString[genderEnum]))}
                                        </option>
                                    );
                                })}
                            </Field>
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="pronounsField" className="form-label">
                                {capitalize(t("pronouns")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="pronouns"
                                required
                                placeholder={capitalize(t("pronouns"))}
                                id="pronounsField"
                                data-testid="pronouns"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="mostFluentLanguageField" className="form-label">
                                {capitalize(t("native language")) + ":"}
                            </label>
                            <Field
                                id="mostFluentLanguageField"
                                type="text"
                                name="mostFluentLanguage"
                                required
                                placeholder={capitalize(t("native language"))}
                                data-testid="mostFluentLanguage"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="englishProficiencyField" className="form-label">
                                {capitalize(t("english proficiency")) + ":"}
                            </label>
                            <Field
                                id="englishProficiencyField"
                                as="select"
                                name="englishProficiency"
                                data-testid="englishProficiency"
                                className={styles.input_field + " " + styles.dropdown_field + " form-select"}
                            >
                                {Object.keys(EnglishProficiency).map((proficiency) => {
                                    const proficiencyEnum =
                                        EnglishProficiency[proficiency as keyof typeof EnglishProficiency];
                                    return (
                                        <option
                                            key={proficiency}
                                            value={proficiencyEnum}
                                            label={capitalize(t(englishProficiencyAsString[proficiencyEnum]))}
                                            data-testid={"proficiency-" + proficiency}
                                        >
                                            {capitalize(t(englishProficiencyAsString[proficiencyEnum]))}
                                        </option>
                                    );
                                })}
                            </Field>
                        </div>
                        <div className="col-sm-4 mb-2">
                            <ItemListForm
                                items={values.studies}
                                setItems={(value) => setFieldValue("studies", value)}
                                itemInputText={capitalize(t("studies"))}
                                itemAddText={capitalize(t("add study"))}
                            />
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="institutionField" className="form-label">
                                {capitalize(t("institution")) + ":"}
                            </label>
                            <Field
                                id="institutionField"
                                type="text"
                                name="institutionName"
                                required
                                placeholder={capitalize(t("institution"))}
                                data-testid="institution"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="currentDiplomaField" className="form-label">
                                {capitalize(t("current diploma")) + ":"}
                            </label>
                            <Field
                                id="currentDiplomaField"
                                type="text"
                                name="currentDiploma"
                                required
                                placeholder={capitalize(t("current diploma"))}
                                data-testid="currentDiploma"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="yearInCourseField" className="form-label">
                                {capitalize(t("year of degree")) + ":"}
                            </label>
                            <Field
                                id="yearInCourseField"
                                type="text"
                                name="yearInCourse"
                                required
                                placeholder={capitalize(t("year of degree"))}
                                data-testid="yearInCourse"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="durationCurrentDegreeField" className="form-label">
                                {capitalize(t("degree length")) + ":"}
                            </label>
                            <Field
                                id="durationCurrentDegreeField"
                                type="number"
                                name="durationCurrentDegree"
                                required
                                placeholder={capitalize(t("degree length"))}
                                data-testid="durationCurrentDegree"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <ItemListForm
                                items={values.skills}
                                setItems={(value) => setFieldValue("skills", value)}
                                itemInputText={capitalize(t("applied for"))}
                                itemAddText={capitalize(t("add role"))}
                                itemPlaceHolderText={capitalize(t("role"))}
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="curriculumVitaeURIField" className="form-label">
                                {capitalize(t("cv url")) + ":"}
                            </label>
                            <Field
                                id="curriculumVitaeURIField"
                                type="text"
                                name="curriculumVitaeURI"
                                placeholder={capitalize(t("cv url"))}
                                data-testid="curriculumVitaeURI"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="portfolioURIField" className="form-label">
                                {capitalize(t("portfolio url")) + ":"}
                            </label>
                            <Field
                                id="portfolioURIField"
                                type="text"
                                name="portfolioURI"
                                placeholder={capitalize(t("portfolio url"))}
                                data-testid="portfolioURI"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="motivationURIField" className="form-label">
                                {capitalize(t("motivation url")) + ":"}
                            </label>
                            <Field
                                id="motivationURIField"
                                type="text"
                                name="motivationURI"
                                placeholder={capitalize(t("motivation url"))}
                                data-testid="motivationURI"
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        {capitalize(t("or"))}
                        <div className="col-sm-5 mb-2">
                            <label htmlFor="writtenMotivationField" className="form-label">
                                {capitalize(t("written motivation")) + ":"}
                            </label>
                            <textarea
                                placeholder={capitalize(t("motivation placeholder"))}
                                id="writtenMotivationField"
                                data-testid="writtenMotivation"
                                value={values.writtenMotivation}
                                onChange={(event) => setFieldValue("writtenMotivation", event.target.value)}
                                className={styles.input_field + " form-control"}
                            />
                        </div>
                        <div className="col-sm-4 mb-4">
                            <label htmlFor="osocExperienceField" className="form-label">
                                {capitalize(t("osoc experience")) + ":"}
                            </label>
                            <Field
                                id="osocExperienceField"
                                as="select"
                                name="osocExperience"
                                data-testid="osocExperience"
                                className={styles.input_field + " " + styles.dropdown_field + " form-select"}
                            >
                                {Object.keys(OsocExperience).map((osocExperience) => {
                                    const experienceEnum =
                                        OsocExperience[osocExperience as keyof typeof OsocExperience];
                                    return (
                                        <option
                                            key={osocExperience}
                                            value={experienceEnum}
                                            label={capitalize(t(osocExperienceAsString[experienceEnum]))}
                                            data-testid={"experience-" + osocExperience}
                                        >
                                            {capitalize(experienceEnum)}
                                        </option>
                                    );
                                })}
                            </Field>
                        </div>
                        <button className="btn btn-primary mb-3" data-testid="submit" type="submit">
                            {student ? capitalize(t("edit student")) : capitalize(t("create student"))}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
