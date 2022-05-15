import { Nav, OverlayTrigger, Popover } from "react-bootstrap";
import applicationPaths from "../../properties/applicationPaths";
import { capitalize } from "../../utility/stringUtil";
import apiPaths from "../../properties/apiPaths";
import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/optionsMenu.module.css";
import Image from "next/image";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import { logoutUser } from "../../api/calls/userCalls";
import { useRouter } from "next/router";

export const OptionsMenu = () => {
    const { t } = useTranslation("common");
    const transformer = useEditionApplicationPathTransformer();
    const router = useRouter();

    // All options are defined here
    // This gets shown when the image is clicked.
    const menu = (
        <Popover id={styles.popover} className={styles.menu}>
            <Nav.Link href={transformer("/" + applicationPaths.profile)} className={styles.menu_option}>
                {capitalize(t("user profile"))}
            </Nav.Link>
            <Nav.Link href={"/" + applicationPaths.editionBase} className={styles.menu_option}>
                {capitalize(t("editions"))}
            </Nav.Link>
            <Nav.Link
                onClick={async () => {
                    await router.push(transformer("/" + applicationPaths.login));
                    await logoutUser();
                }}
                href={undefined}
                className={styles.menu_option}
            >
                {capitalize(t("logout"))}
            </Nav.Link>
        </Popover>
    );

    // This makes it so that when you click the image,
    // the menu above gets shown.
    return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={menu} rootClose={true}>
            <Nav.Link>
                <Image alt="" src={"/resources/profile-icon.svg"} width="25" height="25" />
            </Nav.Link>
        </OverlayTrigger>
    );
};

export default OptionsMenu;
