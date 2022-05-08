import { Nav, OverlayTrigger, Popover } from "react-bootstrap";
import applicationPaths from "../properties/applicationPaths";
import { capitalize } from "../utility/stringUtil";
import apiPaths from "../properties/apiPaths";
import useTranslation from "next-translate/useTranslation";
import styles from "../styles/optionsMenu.module.css";
import Image from "next/image";

export const OptionsMenu = () => {
    const { t } = useTranslation("common");

    // All options are defined here
    // This gets shown when the image is clicked.
    const menu = (
        <Popover id={styles.popover} className={styles.menu}>
            <Nav.Link href={"/" + applicationPaths.profile} className={styles.menu_option}>
                {capitalize(t("user profile"))}
            </Nav.Link>
            <Nav.Link href={apiPaths.base + apiPaths.logout} className={styles.menu_option}>
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
