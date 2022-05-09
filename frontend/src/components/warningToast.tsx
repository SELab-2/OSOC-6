import { Toast, ToastContainer } from "react-bootstrap";
import timers from "../properties/timers";
import { capitalize } from "../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";

function WarningToast(props: {message:string}) {
    const { t } = useTranslation("common");
    const [showDanger, setShowDanger] = useState<boolean>(true);

    return (
        <div data-testid="warning-toast">
            <ToastContainer position="bottom-end">
                <Toast
                    bg="danger"
                    onClose={() => setShowDanger(false)}
                    show={showDanger}
                    delay={timers.toast}
                    autohide
                    data-testid="toast"
                >
                    <Toast.Body>{capitalize(t(props.message))}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default WarningToast;
