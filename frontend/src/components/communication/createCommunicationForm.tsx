import {IStudent} from "../../api/entities/StudentEntity";
import {useSWRConfig} from "swr";
import {Field, Form, Formik} from "formik";
import {Communication, defaultCommunicationMedium} from "../../api/entities/CommunicationEntity";
import {useCurrentUser} from "../../hooks/useCurrentUser";
import {createCommunicationSubmitHandler} from "../../handlers/createCommunicationSubmitHandler";
import {ChangeEvent} from "react";
import {ICommunicationTemplate} from "../../api/entities/CommunicationTemplateEntity";
import { Button } from "react-bootstrap";
import {useRouter} from "next/router";
import useTranslation from "next-translate/useTranslation";
import {capitalize} from "../../utility/stringUtil";
import mailTo from "../../utility/mailTo";
import applicationPaths from "../../properties/applicationPaths";
import {extractIdFromUserUrl} from "../../api/calls/userCalls";
import {useEditionApplicationPathTransformer} from "../../hooks/utilHooks";

export interface CreateCommunicationFormProps {
    student: IStudent;
    template: ICommunicationTemplate;
}

export default function CreateCommunicationForm({student, template}: CreateCommunicationFormProps) {
    const {t} = useTranslation("common");
    const router = useRouter();
    const {mutate} = useSWRConfig();
    const {user, error: userError} = useCurrentUser();
    const transformer = useEditionApplicationPathTransformer();

    // We don't fill the sender and student because using the hooks this would require a reset of the initial values of the form.
    // Waiting to fill this avoids the reset.
    const initialValues = {
        medium: defaultCommunicationMedium,
        template: template._links.self.href,
        content: template.template,
        sender: "",
        student: "",
        subject: template.subject,
    };

    if (userError) {
        console.log(userError);
        return null;
    }

    return (
        <div data-testid="create-communication-form">
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (submitValues) => {
                    const submitCom = new Communication(
                        submitValues.medium,
                        submitValues.template,
                        submitValues.subject,
                        submitValues.content,
                        submitValues.sender,
                        submitValues.student
                    );
                    submitCom.student = student._links.self.href;
                    submitCom.sender = user!._links.self.href;
                    await createCommunicationSubmitHandler(submitCom, router, mutate);

                    // If the medium is email : open the mail client
                    if (submitCom.medium === defaultCommunicationMedium) {
                        document.location.href = mailTo({
                            body: submitValues.content,
                            subject: submitValues.subject,
                            recipients: [student.email],
                        });
                    }

                    const id = extractIdFromUserUrl(student._links.self.href);
                    const url =
                        "/" + applicationPaths.students + "/" + id + "/" + applicationPaths.communicationBase;

                    await router.push(transformer(url));
                }}
            >
                {({values, setFieldValue}) => (
                    <Form>
                        <div>
                            <h2>Communication</h2>
                            <hr/>
                            <div className="text-wrap">
                                {capitalize(t("for")) + ": " + student?.email}
                            </div>
                            <div>
                                <label htmlFor="communicationTemplateSubjectField">
                                    {capitalize(t("subject")) + ":"}
                                </label>
                                <Field
                                    type="text"
                                    name="subject"
                                    required
                                    style={{
                                        backgroundColor: "#1b1a31",
                                        borderColor: "white",
                                        borderWidth: 1,
                                        color: "white",
                                        marginLeft: 10,
                                        marginBottom: 10,
                                        marginTop: 5,
                                        paddingLeft: 10,
                                    }}
                                    placeholder={capitalize(t("subject"))}
                                    id="communicationTemplateSubjectField"
                                    data-testid="subject"
                                />
                            </div>
                            <div>
                                <label htmlFor="communicationTemplateSubjectField">
                                    {capitalize(t("medium")) + ":"}
                                </label>
                                <Field
                                    type="text"
                                    name="medium"
                                    required
                                    style={{
                                        backgroundColor: "#1b1a31",
                                        borderColor: "white",
                                        borderWidth: 1,
                                        color: "white",
                                        marginLeft: 10,
                                        marginBottom: 20,
                                        marginTop: 5,
                                        paddingLeft: 10,
                                    }}
                                    placeholder={capitalize(t("medium"))}
                                    id="communicationTemplateSubjectField"
                                    data-testid="medium"
                                />
                            </div>

                            <div>
                                    <textarea
                                        placeholder={capitalize(t("template placeholder"))}
                                        className="form-control"
                                        name="content"
                                        data-testid="content"
                                        value={values.content}
                                        style={{
                                            backgroundColor: "#1b1a31",
                                            borderColor: "white",
                                            borderWidth: 1,
                                            height: "100px",
                                            color: "white",
                                            marginLeft: 10,
                                            marginBottom: 10,
                                            paddingLeft: 10,
                                        }}
                                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                                            setFieldValue("content", event.target.value);
                                        }}
                                    />
                            </div>
                            <div style={{display: "flex", flexDirection: "row-reverse"}}>
                                <Button
                                    className="capitalize"
                                    data-testid="submit"
                                    type="submit"
                                    style={{
                                        backgroundColor: "#1b1a31",
                                        borderColor: "white",
                                        height: 30,
                                        alignItems: "center",
                                        display: "flex",
                                    }}
                                >
                                    {capitalize(t("confirm"))}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
