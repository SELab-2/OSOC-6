import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import NavBar from "../components/util/navBar";

const BeginPage: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <NavBar />
            <main className="m-4">
                <h1 className="capitalize">{t("empty page")}</h1>
            </main>
        </div>
    );
};

export default BeginPage;
