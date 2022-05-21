import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEditionApplicationPathTransformer } from "../hooks/utilHooks";
import applicationPaths from "../properties/applicationPaths";

const BeginPage: NextPage = () => {
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    router.replace(transformer("/" + applicationPaths.assignStudents)).catch(console.log);

    return null;
};

export default BeginPage;
