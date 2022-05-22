import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEditionApplicationPathTransformer } from "../hooks/utilHooks";
import applicationPaths from "../properties/applicationPaths";
import { useRouterReplace } from "../hooks/routerHooks";

const BeginPage: NextPage = () => {
    const routerAction = useRouterReplace();
    routerAction("/" + applicationPaths.assignStudents).catch(console.log);

    return null;
};

export default BeginPage;
