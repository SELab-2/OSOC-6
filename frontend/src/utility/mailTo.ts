/**
 * Option you can give when setting up a mail.
 */
export interface MailOptions {
    recipients?: string[];
    subject?: string;
    body?: string;
}

/**
 * Function formatting [MailOptions] to the mailTo format expected by HTML.
 * @param option the options that need to be formatted.
 */
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
