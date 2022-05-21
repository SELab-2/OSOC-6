import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import {getAllSkillTypesFromPage} from "../../api/calls/skillTypeCalls";
import {ISkillType} from "../../api/entities/SkillTypeEntity";
import {getQueryUrlFromParams} from "../../api/calls/baseCalls";
import SkillTypeList from "../../components/skillType/skillTypeList";
import NavBar from "../../components/util/navBar";
import {capitalize} from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/skillTypes.module.css";
import {Button} from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import {useEditionApplicationPathTransformer} from "../../hooks/utilHooks";
import {useRouter} from "next/router";

export default function SkillTypeIndexPage() {
    const { t } = useTranslation("common");
    const transformer = useEditionApplicationPathTransformer();
    const router = useRouter();
    const { data: receiveSkillTypes, error: skillTypesError } = useSWR(
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
            <NavBar/>
            <div className="container mt-3">
                <div className={styles.skill_types}>
                    <h2 className="d-flex">{capitalize(t("skill types"))}</h2>
                    <div>
                        <Button
                            className="mt-2"
                            variant="outline-primary"
                            onClick={() =>
                                router.push(transformer("/" + applicationPaths.skillTypesCreate))
                            }
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
                    <div className="mt-2">
                        <SkillTypeList skillTypes={skillTypes} />
                    </div>
                </div>
            </div>
        </>
    );
}
