import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import apiPaths from "../properties/apiPaths";
import { AxiosConf } from "../api/calls/baseCalls";
import Router from "next/router";
import applicationPaths from "../properties/applicationPaths";
import ApiPaths from "../properties/apiPaths";

export default function RouteGuard({ children }: any) {
    const [authorized, setAuthorized] = useState(false);

    console.log("Use effect");
    useEffect(() => {
        // Check the authentication of the current path
        authCheck(Router.asPath);
    }, []);

    async function authCheck(url: string) {
        // Define the public paths for which authentication is not needed.
        const publicPaths = [
            applicationPaths.base,
            applicationPaths.base + applicationPaths.login,
            applicationPaths.base + applicationPaths.loginError,
        ];
        // Check if the user is logged in. If not this request will be redirected to the backend login
        const userResponse: AxiosResponse = await axios.get(apiPaths.ownUser, AxiosConf);

        if (
            !publicPaths.includes(url) &&
            userResponse.request.responseURL == ApiPaths.base + ApiPaths.backendLogin
        ) {
            setAuthorized(false);
            // window.location.replace is needed since Router.push does not invoke useEffect on redirect.
            window.location.replace("/login");
        } else {
            setAuthorized(true);
        }
    }

    return authorized && children;
}
