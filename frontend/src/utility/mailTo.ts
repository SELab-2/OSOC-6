export interface MailOptions {
    subjects?: string[];
    body?: string;
}

export default function mailTo(option?: MailOptions): string {
    if (!option) {
        return "";
    }
    let builder = "mailto:" + (option.subjects || []).join(";");
    if (option.body) {
        builder += "?body=" + encodeURIComponent(option.body);
    }
    return builder;
}
