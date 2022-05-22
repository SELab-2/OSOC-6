import SkillTypeForm from "../../components/skillType/skillTypeForm";
import NavBar from "../../components/util/navBar";
import { capitalize } from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/skillTypes.module.css";
import { Background } from "../../components/util/background";

export default function CreateSkillTypePage() {
    const { t } = useTranslation("common");

    return (
        <>
            <NavBar />
            <Background />
            <div className={"container mt-3"}>
                <div className={styles.skill_types_box}>
                    <h2>{capitalize(t("create skill type"))}</h2>
                    <hr />
                    <SkillTypeForm />
                </div>
            </div>
        </>
    );
}
