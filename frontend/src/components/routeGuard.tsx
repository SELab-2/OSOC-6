import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import apiPaths from "../properties/apiPaths";
import { AxiosConf } from "../api/calls/baseCalls";
import Router, { useRouter } from "next/router";
import applicationPaths from "../properties/applicationPaths";
import ApiPaths from "../properties/apiPaths";

export default function RouteGuard({ children }: any) {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const { push } = useRouter();

    useEffect(() => {
        // Check the authentication of the current path
        authCheck(Router.asPath);
    }, [authCheck]);

    async function authCheck(url: string) {
        // Define the public paths for which authentication is not needed.
        const publicPaths = [
            "/" + applicationPaths.index,
            "/" + applicationPaths.login,
            "/" + applicationPaths.loginError,
            "/" + applicationPaths.registration,
        ];

        // Check if the user is logged in. If not this request will be redirected to the backend login
        const userResponse: AxiosResponse = await axios.get(apiPaths.ownUser, AxiosConf);
        const path = url.split("?")[0];

        // A request to the backend will return redirect to the login when the user was not authenticated
        if (
            !publicPaths.includes(path) &&
            userResponse.request.responseURL == ApiPaths.base + ApiPaths.loginRedirect
        ) {
            setAuthorized(false);
            await push({
                pathname: applicationPaths.login,
                query: { returnUrl: Router.asPath },
            });
        } else {
            setAuthorized(true);
        }
    }

    return authorized && children;
}
