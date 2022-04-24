import useTranslation from "next-translate/useTranslation";
import { Button, ButtonGroup } from "react-bootstrap";
import Router from "next/router";
import applicationPaths from "../properties/applicationPaths";

export const NewProjectButton = () => {
    const { t } = useTranslation("common");
    return (
        <ButtonGroup className="d-flex" data-testid="newproject-button">
            <Button
                className="w-100, capitalize"
                variant="primary"
                size="lg"
                onClick={() => Router.push("/" + applicationPaths.projectCreation)}
            >
                {t("new project")}
            </Button>
        </ButtonGroup>
    );
};
