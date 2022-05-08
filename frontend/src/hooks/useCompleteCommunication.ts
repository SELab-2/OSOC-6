import { ICommunication } from "../api/entities/CommunicationEntity";
import { ICommunicationTemplate } from "../api/entities/CommunicationTemplateEntity";
import useSWR from "swr";
import { getCommunicationOnUrl } from "../api/calls/communicationCalls";
import { getCommunicationTemplateOnUrl } from "../api/calls/communicationTemplateCalls";
import { getStudentOnUrl } from "../api/calls/studentCalls";
import { IStudent } from "../api/entities/StudentEntity";

export interface ICompleteCommunication {
    communication?: ICommunication;
    template?: ICommunicationTemplate;
    student?: IStudent;
}

/**
 * We use a hook here so we can use the cache when accessing the student
 * @param url
 */
export default function useCompleteCommunicationOnUrl(url: string): {
    data?: ICompleteCommunication;
    error?: Error;
} {
    const { data: communication, error: comError } = useSWR(url, getCommunicationOnUrl);
    const { data: template, error: templateError } = useSWR(
        communication ? communication._links.template.href : null,
        getCommunicationTemplateOnUrl
    );
    const { data: student, error: studError } = useSWR(
        communication ? communication._links.student.href : null,
        getStudentOnUrl
    );

    return {
        data: {
            communication,
            template,
            student,
        },
        error: comError || templateError || studError,
    };
}
