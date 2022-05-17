import useTranslation from "next-translate/useTranslation";
import CreateCommunicationTemplateForm from "../../components/communication/createCommunicationTemplateForm";

/**
 * Component allowing the creation of a new communication template.
 */
export default function CommunicationTemplateCreate() {
    const { t } = useTranslation("common");

    return (
        <div data-testid="communication-template-create">
            <h1 className="capitalize">{t("create communication template")}</h1>
            <CreateCommunicationTemplateForm />
        </div>
    );
}
