import useTranslation from 'next-translate/useTranslation';
import {Button, ButtonGroup} from 'react-bootstrap';
import Router from 'next/router';
import pathNames from "../properties/pathNames";

export const NewProjectButton = () => {
    const { t } = useTranslation();
    return (
        <ButtonGroup className="d-flex">
            <Button
                className="w-100"
                variant="primary"
                size="lg"
                onClick={() => Router.push(pathNames.projectCreation)}
            >
                {t('common:New project button')}
            </Button>
        </ButtonGroup>
    );
};