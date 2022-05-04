import applicationPaths from "../properties/applicationPaths";

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
