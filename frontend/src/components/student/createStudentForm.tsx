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
import { ChangeEvent, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";

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

    const [selectedGender, setSelectedGender] = useState<Gender>(Gender.not_specified);
    const [selectedEnglishProficiency, setSelectedEnglishProficiency] = useState<EnglishProficiency>(
        EnglishProficiency.expressive
    );
    const [studies, setStudies] = useState<string[]>([]);
    const [studyInput, setStudyInput] = useState<string>("");
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState<string>("");
    const [selectedOsocExperience, setSelectedOsocExperience] = useState<OsocExperience>(OsocExperience.none);

    if (!editionUrl) {
        console.log(!editionUrl);
        return null;
    }
    const initialValues: Student = studentFromIStudent(editionUrl, student ? student : emptyStudent);

    function handleChangeGender(e: ChangeEvent<HTMLInputElement>) {
        setSelectedGender(e.target.value as Gender);
    }

    function handleChangeEnglishProficiency(e: ChangeEvent<HTMLInputElement>) {
        setSelectedEnglishProficiency(e.target.value as EnglishProficiency);
    }

    function handleChangeStudyInput(e: ChangeEvent<HTMLInputElement>) {
        setStudyInput(e.target.value);
    }

    function handleChangeSkillInput(e: ChangeEvent<HTMLInputElement>) {
        setSkillInput(e.target.value);
    }

    function handleChangeOsocExperience(e: ChangeEvent<HTMLInputElement>) {
        setSelectedOsocExperience(e.target.value as OsocExperience);
    }

    function handleAddStudy() {
        if (studyInput) {
            const newStudies: string[] = studies.concat(studyInput);

            setStudies(newStudies);
            setStudyInput("");
        }
    }

    function handleAddSkill() {
        if (skillInput) {
            const newSkills: string[] = skills.concat(skillInput);

            setSkills(newSkills);
            setSkillInput("");
        }
    }

    function handleDeleteStudy(index: number) {
        delete studies[index];
        setStudies(studies.filter((value) => value !== undefined));
    }

    function handleDeleteSkill(index: number) {
        delete skills[index];
        setSkills(skills.filter((value) => value !== undefined));
    }

    return (
        <div className="container mt-3">
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
                            <label htmlFor="studentCallNameField" className="form-label">
                                {capitalize(t("callname")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="callName"
                                required
                                value={values.callName}
                                placeholder={capitalize(t("callname"))}
                                id="studentCallNameField"
                                data-testid="callName"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="studentFirstNameField" className="form-label">
                                {capitalize(t("first name")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="firstName"
                                required
                                placeholder={capitalize(t("first name"))}
                                id="studentFirstNameField"
                                data-testid="firstName"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="studentLastNameField" className="form-label">
                                {capitalize(t("last name")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="lastName"
                                required
                                placeholder={capitalize(t("last name"))}
                                id="studentLastNameField"
                                data-testid="lastName"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-4 mb-2">
                            <label htmlFor="studentEmailField" className="form-label">
                                {capitalize(t("email")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="email"
                                required
                                placeholder={capitalize(t("email"))}
                                id="studentEmailField"
                                data-testid="email"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="studentPhoneNumberField" className="form-label">
                                {capitalize(t("phone number")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="phoneNumber"
                                required
                                placeholder={capitalize(t("phone number"))}
                                id="studentPhoneNumberField"
                                data-testid="phoneNumber"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="studentGenderField" className="form-label">
                                {capitalize(t("gender")) + ":"}
                            </label>
                            <Field
                                id="studentGenderField"
                                as="select"
                                name="gender"
                                data-testid="gender"
                                value={selectedGender}
                                onChange={handleChangeGender}
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
                            <label htmlFor="studentPronounsField" className="form-label">
                                {capitalize(t("pronouns")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="pronouns"
                                required
                                placeholder={capitalize(t("pronouns"))}
                                id="studentPronounsField"
                                data-testid="pronouns"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="studentMostFluentLanguageField" className="form-label">
                                {capitalize(t("native language")) + ":"}
                            </label>
                            <Field
                                id="studentMostFluentLanguageField"
                                type="text"
                                name="mostFluentLanguage"
                                required
                                placeholder={capitalize(t("native language"))}
                                data-testid="mostFluentLanguage"
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-2 mb-2">
                            <label htmlFor="studentEnglishProficiencyField" className="form-label">
                                {capitalize(t("english proficiency")) + ":"}
                            </label>
                            <Field
                                id="studentEnglishProficiencyField"
                                as="select"
                                name="englishProficiency"
                                data-testid="englishProficiency"
                                value={selectedEnglishProficiency}
                                onChange={handleChangeEnglishProficiency}
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
                        <div>
                            {studies.map((study: string, index: number) => (
                                <Row key={index}>
                                    <Col>{study}</Col>
                                    <Col xs={1}>
                                        <a>
                                            <Image
                                                onClick={() => handleDeleteStudy(index)}
                                                alt=""
                                                src={"/resources/delete.svg"}
                                                width="15"
                                                height="15"
                                            />
                                        </a>
                                    </Col>
                                </Row>
                            ))}
                            <label htmlFor="studentStudiesField">{capitalize(t("studies")) + ":"}</label>
                            <Field
                                id="studentStudiesField"
                                data-testid="study-input"
                                value={studyInput}
                                placeholder={capitalize(t("studies"))}
                                onChange={handleChangeStudyInput}
                            />
                            <button type="button" onClick={handleAddStudy} data-testid="add-study-button">
                                {capitalize(t("add study"))}
                            </button>
                        </div>
                        <div className="col-sm-3 mb-2">
                            <label htmlFor="studentInstitutionField" className="form-label">
                                {capitalize(t("institution")) + ":"}
                            </label>
                            <Field
                                id="studentInstitutionField"
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
                        <div>
                            {skills.map((skill: string, index: number) => (
                                <Row key={index}>
                                    <Col>{skill}</Col>
                                    <Col xs={1}>
                                        <a>
                                            <Image
                                                onClick={() => handleDeleteSkill(index)}
                                                alt=""
                                                src={"/resources/delete.svg"}
                                                width="15"
                                                height="15"
                                            />
                                        </a>
                                    </Col>
                                </Row>
                            ))}
                            <label htmlFor="studentSkillsField">{capitalize(t("applied for")) + ":"}</label>
                            <Field
                                id="studentSkillsField"
                                data-testid="skill-input"
                                value={skillInput}
                                placeholder={capitalize(t("role"))}
                                onChange={handleChangeSkillInput}
                            />
                            <button type="button" onClick={handleAddSkill} data-testid="add-skill-button">
                                {capitalize(t("add role"))}
                            </button>
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
                                onChange={(event) => setFieldValue("template", event.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-sm-3 mb-4">
                            <label htmlFor="osocExperienceField" className="form-label">
                                {capitalize(t("osoc experience")) + ":"}
                            </label>
                            <Field
                                id="osocExperienceField"
                                as="select"
                                name="osocExperience"
                                data-testid="osocExperience"
                                value={selectedOsocExperience}
                                onChange={handleChangeOsocExperience}
                                className="form-select"
                            >
                                {Object.keys(OsocExperience).map((osocExperience) => (
                                    <option
                                        key={osocExperience}
                                        value={OsocExperience[osocExperience as keyof typeof OsocExperience]}
                                        label={capitalize(
                                            t(OsocExperience[osocExperience as keyof typeof OsocExperience])
                                        )}
                                        data-testid={"gender-" + osocExperience}
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
