import applicationPaths from "../properties/applicationPaths";

/**
 * Function that checks if a path is a path that can be accessed without authentication.
 * @param url
 */
export function pathIsAuthException(url: string): boolean {
    // Define the public paths for which authentication is not needed.
    const publicPaths = [
        "/" + applicationPaths.index,
        "/" + applicationPaths.login,
        "/" + applicationPaths.loginError,
        "/" + applicationPaths.registration,
    ];

    // Check if the user is logged in. If not this will have no result

    const path = url.split("?")[0];

    // A request to the backend will return redirect to the login when the user was not authenticated
    return publicPaths.includes(path);
}

/**
 * Function that checks if a path is allowed to be visited by a coach
 * @param url
 */
export function pathIsForbiddenForCoach(url: string): boolean {
    // I decided it's best to use regex, because in the future we might get
    // something/[id]/edit for example, regex makes this easier to match
    const forbiddenRoutes = [
        // Users
        "users$",

        // Projects create only
        "projects/create$",

        // Communication templates
        "communicationTemplates$",
        "communicationTemplates/create$",
        "communicationTemplates/[0-9]*$",

        // Communication
        "communications$",
        "communications/[0-9]*$",

        // Editions
        "editions/[0-9]*$",
        "editions/create$",
    ];

    let routerPath = url.substring(1);
    const indexOfQuestionMark = routerPath.indexOf("?");

    // String contains ?
    if (indexOfQuestionMark !== -1) {
        routerPath = routerPath.substring(0, indexOfQuestionMark);
    }

    for (const route of forbiddenRoutes) {
        const matches = routerPath.match(route);
        if (matches !== null) {
            return true;
        }
    }

    return false;
}
