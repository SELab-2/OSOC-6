import { ICommunication } from "../api/entities/CommunicationEntity";
import { ICommunicationTemplate } from "../api/entities/CommunicationTemplateEntity";
import useSWR from "swr";
import { getCommunicationOnUrl } from "../api/calls/communicationCalls";
import { getCommunicationTemplateOnUrl } from "../api/calls/communicationTemplateCalls";
import { getStudentOnUrl } from "../api/calls/studentCalls";
import { IStudent } from "../api/entities/StudentEntity";
import { CommonSWRConfig } from "./shared";

/**
 * Interface describing the shape of a single full Communication type.
 */
export interface IFullCommunication {
    communication?: ICommunication;
    template?: ICommunicationTemplate;
    student?: IStudent;
}

/**
 * SWR based hook returning a [IFullCommunication].
 * @param url the url hosting the [ICommunication] entity that should be completed.
 * @param config [CommonSWRConfig] config that allows to set shared SWR configurations.
 */
export default function useCompleteCommunicationOnUrl(
    url: string,
    config?: CommonSWRConfig
): {
    data?: IFullCommunication;
    error?: Error;
} {
    const { data: communication, error: comError } = useSWR(url, getCommunicationOnUrl, config);
    const { data: template, error: templateError } = useSWR(
        communication ? communication._links.template.href : null,
        getCommunicationTemplateOnUrl,
        config
    );
    const { data: student, error: studError } = useSWR(
        communication ? communication._links.student.href : null,
        getStudentOnUrl,
        config
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
