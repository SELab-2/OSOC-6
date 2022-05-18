import useTranslation from "next-translate/useTranslation";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import applicationPaths from "../../properties/applicationPaths";
import styles from "../../styles/projects/projectList.module.css";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";

export const NewProjectButton = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    return (
        <Button
            data-testid="new-project-button"
            className={"capitalize d-flex justify-content-center " + styles.project_list_button}
            variant="outline-primary"
            size="lg"
            onClick={() => router.push(transformer("/" + applicationPaths.projectCreation))}
        >
            {t("new project")}
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
    );
};
