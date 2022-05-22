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

    function addSeparatorToken(url: string): string {
        return url.indexOf("?") === -1 ? url + "?" : url + "&";
    }

    if (option.subject) {
        builder = addSeparatorToken(builder) + "subject=" + encodeURIComponent(option.subject);
    }
    if (option.body) {
        builder = addSeparatorToken(builder) + "body=" + encodeURIComponent(option.body);
    }
    return builder;
}
