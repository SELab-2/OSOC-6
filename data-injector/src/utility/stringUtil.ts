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
