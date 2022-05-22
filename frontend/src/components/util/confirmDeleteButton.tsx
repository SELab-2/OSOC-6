import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import Image from "next/image";

/**
 * The props needed for the ForgotComponent.
 */
interface ConfirmDeleteButtonProps {
    dataTestId?: string;
    handler: () => void;
}

/**
 * A delete button that asks for confirmation before deletion.
 * @param handler the delete handler
 * @param dataTestId the test id of this delete button, used for testing
 */
export function ConfirmDeleteButton({ handler, dataTestId }: ConfirmDeleteButtonProps) {
    const { t } = useTranslation("common");

    function handleDelete() {
        const result = confirm(capitalize(t("confirm delete")));
        if (result) {
            handler();
        }
    }

    return (
        <a
            className="clickable"
            data-testid={dataTestId ? dataTestId : "confirm-delete-button"}
            onClick={() => handleDelete()}
        >
            <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
        </a>
    );
}
