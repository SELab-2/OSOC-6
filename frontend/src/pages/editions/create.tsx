import useTranslation from "next-translate/useTranslation";
import { NextPage } from "next";
import CreateEditionForm from "../../components/edition/createEditionForm";

/**
 * Component allowing the creation of a new edition.
 */
const CreateEdition: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div data-testid="edition-create">
            <h1 className="capitalize">{t("create new edition")}</h1>
            <CreateEditionForm />
        </div>
    );
};

export default CreateEdition;
