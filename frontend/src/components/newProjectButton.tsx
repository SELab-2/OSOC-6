import useTranslation from "next-translate/useTranslation";
import { Button, ButtonGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import applicationPaths from "../properties/applicationPaths";
import styles from "../styles/projectList.module.css";
import { useEditionPathTransformer } from "../api/calls/baseCalls";

export const NewProjectButton = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionPathTransformer();
    return (
        <ButtonGroup className={"d-flex " + styles.project_list_button} data-testid="new-project-button">
            <Button
                className="w-100, capitalize"
                variant="primary"
                size="lg"
                onClick={() => router.push(transformer("/" + applicationPaths.projectCreation))}
            >
                {t("new project")}
            </Button>
        </ButtonGroup>
    );
};
