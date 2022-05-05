/**
 * Function capitalizing the first letter.
 * @param str the capitalized string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
