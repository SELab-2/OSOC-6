export interface MailOptions {
    recipients?: string[];
    subject?: string;
    body?: string;
}

export default function mailTo(option?: MailOptions): string {
    if (!option) {
        return "";
    }
    let builder = "mailto:" + (option.recipients || []).join(";");
    if (option.subject) {
        builder += "?subject=" + encodeURIComponent(option.subject);
    }
    if (option.body) {
        builder += "&body=" + encodeURIComponent(option.body);
    }
    return builder;
}
