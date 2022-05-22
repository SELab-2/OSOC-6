/**
 * Function capitalizing the first letter.
 * @param str the capitalized string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Function capitalizing the first letter of every word.
 * @param str the capitalized string
 */
export function capitalize_complete(str: string): string {
    return str.split(" ").map(capitalize).join(" ");
}

/**
 * Function checking whether or not a string is a valid URI or an empty string
 * @param uri uri that needs to be checked
 */
export function isValidURIOrEmpty(uri: string): boolean {
    const URIRegExp: RegExp = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
            "((\\d{1,3}\\.){3}\\d{1,3}))" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$",
        "i"
    );
    ///((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
    return URIRegExp.test(uri) || uri === "";
}
