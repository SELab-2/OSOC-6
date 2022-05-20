import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { useSWRConfig } from "swr";
import {
    emptyStudent,
    EnglishProficiency,
    Gender,
    IStudent,
    OsocExperience,
    Student,
    studentFromIStudent,
} from "../../api/entities/StudentEntity";
import useEdition from "../../hooks/useGlobalEdition";
import { createStudentSubmitHandler } from "../../handlers/createStudentSubmitHandler";
import ItemListForm from "../util/itemListForm";

/**
 * Props needed for the create student form.
 */
export interface CreateStudentFormProps {
    student?: IStudent;
    title: string;
}

/**
 * Form allowing the creation of a new communication template.
 */
export default function CreateStudentForm({ student, title }: CreateStudentFormProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const [editionUrl] = useEdition();

    if (!editionUrl) {
        console.log(!editionUrl);
        return null;
    }
    const initialValues: Student = studentFromIStudent(editionUrl, student ? student : emptyStudent);

    return (
        <div className="container mt-3" data-testid="student-create">
            <h2>{title}</h2>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={(values) =>
                    createStudentSubmitHandler(
                        student ? student._links.self.href : null,
                        values,
                        router,
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-select"
                            >
                                {Object.keys(Gender).map((gender) => (
                                    <option
                                        key={gender}
                                        value={Gender[gender as keyof typeof Gender]}
                                        label={capitalize(gender.replace("_", " "))}
                                        data-testid={"gender-" + gender}
                                    >
                                        {capitalize(gender)}
                                    </option>
                                ))}
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-select"
                            >
                                {Object.keys(EnglishProficiency).map((proficiency) => (
                                    <option
                                        key={proficiency}
                                        value={
                                            EnglishProficiency[proficiency as keyof typeof EnglishProficiency]
                                        }
                                        label={capitalize(
                                            proficiency.replace(/[A-Z]/g, " $&").trim().toLowerCase()
                                        )}
                                        data-testid={"proficiency-" + proficiency}
                                    ></option>
                                ))}
                            </Field>
                        </div>
                        <div className="col-sm-3 mb-2">
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3 mb-2">
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
                                className="form-control"
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
                                className="form-control"
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
                                className="form-control"
                            />
                        </div>
                        Or
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
                                className="form-control"
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
                                className="form-select"
                            >
                                {Object.keys(OsocExperience).map((osocExperience) => (
                                    <option
                                        key={osocExperience}
                                        value={OsocExperience[osocExperience as keyof typeof OsocExperience]}
                                        label={capitalize(
                                            t(OsocExperience[osocExperience as keyof typeof OsocExperience])
                                        )}
                                        data-testid={"experience-" + osocExperience}
                                    >
                                        {capitalize(osocExperience)}
                                    </option>
                                ))}
                            </Field>
                        </div>
                        <button className="btn btn-primary mb-3" data-testid="submit" type="submit">
                            {capitalize(t("confirm"))}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
