import apiPaths from "../../properties/apiPaths";
import { getAllSkillTypesFromPage } from "../../api/calls/skillTypeCalls";
import { ISkillType } from "../../api/entities/SkillTypeEntity";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import SkillTypeList from "../../components/skillType/skillTypeList";
import NavBar from "../../components/util/navBar";
import { capitalize } from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/skillTypes.module.css";
import { Button } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { useRouterPush } from "../../hooks/routerHooks";
import { useSwrForEntityList } from "../../hooks/utilHooks";
import { Background } from "../../components/util/background";

export default function SkillTypeIndexPage() {
    const { t } = useTranslation("common");
    const routerAction = useRouterPush();
    const { data: receiveSkillTypes, error: skillTypesError } = useSwrForEntityList(
        getQueryUrlFromParams(apiPaths.skillTypes, { sort: "name" }),
        getAllSkillTypesFromPage
    );

    if (skillTypesError) {
        console.log(skillTypesError);
        return null;
    }

    const skillTypes: ISkillType[] = receiveSkillTypes || [];

    return (
        <>
            <NavBar />
            <Background />
            <div className="container" style={{ marginTop: "2rem" }}>
                <div className={styles.skill_types}>
                    <div style={{ display: "flex" }}>
                        <h2 className="d-flex">{capitalize(t("skill types"))}</h2>
                        <div style={{ marginLeft: "auto", marginRight: "0" }}>
                            <Button
                                data-testid="new-skill-type-button"
                                className="mt-2"
                                variant="outline-primary"
                                onClick={() => routerAction("/" + applicationPaths.skillTypesCreate)}
                            >
                                {capitalize(t("create skill type"))}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1.5em"
                                    height="1.5em"
                                    fill="currentColor"
                                    className="bi bi-plus"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                    <hr />
                    <div className="mt-2">
                        <SkillTypeList skillTypes={skillTypes} />
                    </div>
                </div>
            </div>
        </>
    );
}
