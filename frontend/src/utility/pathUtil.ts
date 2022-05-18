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
export function pathIsAllowedForCoach(url: string): boolean {
    const forbiddenRoutes = [
        // Users
        "users",

        // Projects create only
        "projects/create",

        // Communication templates
        "communicationTemplates",

        // Communication
        "communications",

        // Editions
        "editions/",
        "editions/create",
    ];

    const routerPath = url.substring(1);
    const indexOfQuestionMark = routerPath.indexOf("?");
    const indexOfSlash = routerPath.lastIndexOf("/");

    if (forbiddenRoutes.includes(routerPath.substring(0, indexOfQuestionMark))) {
        return false;
    } else if (indexOfSlash !== -1 && forbiddenRoutes.includes(routerPath.substring(0, indexOfSlash + 1))) {
        return false;
    }

    return true;
}
