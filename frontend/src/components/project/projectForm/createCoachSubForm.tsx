import { ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import Image from "next/image";
import { capitalize } from "../../../utility/stringUtil";
import { ChangeEvent, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import {
    useSwrForEntityList,
    useSwrForEntityListWithEdition,
    useSwrWithEdition,
} from "../../../hooks/utilHooks";
import apiPaths from "../../../properties/apiPaths";
import { getAllUsersFromPage } from "../../../api/calls/userCalls";
import { IUser } from "../../../api/entities/UserEntity";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import styles from "../../../styles/projects/createProject.module.css";

/**
 * Properties needed by [CreateCoachSubForm].
 */
export interface CreateCoachSubFormProps {
    setCoachUrls: (urls: string[]) => void;
    illegalCoaches: string[];
}

/**
 * SubForm allowing you to link new coaches to a project.
 * @param setCoachUrls callBack that sets the selected coaches as a URI.
 * @param illegalCoaches list of coaches that should not be added.
 */
export default function CreateCoachSubForm({ setCoachUrls, illegalCoaches }: CreateCoachSubFormProps) {
    const { t } = useTranslation("common");
    const { data: receivedUsers, error: usersError } = useSwrForEntityListWithEdition(
        apiPaths.userByEdition,
        getAllUsersFromPage
    );
    const allUsers: IUser[] = receivedUsers || [];

    const [selectedCoach, setSelectedCoach] = useState<string>("");
    const [coaches, setCoaches] = useState<string[]>([]);

    const baseUser = allUsers[0]?.callName;
    useEffect(() => {
        setSelectedCoach(baseUser);
    }, [baseUser]);

    if (usersError) {
        console.log(usersError);
        return null;
    }

    function handleAddCreatedCoach() {
        const newCoach = selectedCoach ? selectedCoach : allUsers[0].callName;
        if (!selectedCoach) {
            setSelectedCoach(newCoach);
        }

        if (!coaches.includes(newCoach) && !illegalCoaches.includes(newCoach)) {
            const newCoaches = [...coaches, newCoach];
            setCoaches(newCoaches);

            setCoachUrls(
                newCoaches.map(
                    (coach) =>
                        // We know there will always be a user with this callname,
                        // as every option of the Select contains a value that originates from the users-array
                        allUsers.find((item) => item.callName === coach)!._links.self.href
                )
            );
        }
    }

    return (
        <div>
            <ul style={{ listStyleType: "circle" }}>
                {illegalCoaches.length === 0 && coaches.length === 0 && (
                    <Row style={{ justifyContent: "center" }}>{capitalize(t("no coaches added yet"))}</Row>
                )}
                {coaches.map((coach: string, index: number) => (
                    <li key={index} style={{ marginLeft: "3rem" }}>
                        <Row key={index}>
                            <Col>{coach}</Col>
                            <Col xs={1}>
                                <a
                                    data-testid={"remove-added-coach-" + coach}
                                    onClick={() =>
                                        setCoaches(coaches.filter((_, valIndex) => valIndex !== index))
                                    }
                                >
                                    <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                                </a>
                            </Col>
                        </Row>
                    </li>
                ))}
            </ul>
            <div style={{ display: "flex" }}>
                <div style={{ marginLeft: "auto", marginRight: "0" }}>
                    <Dropdown as={ButtonGroup} drop="down">
                        <Dropdown.Toggle
                            style={{
                                backgroundColor: "#0a0839",
                                borderColor: "white",
                                height: 30,
                                alignItems: "center",
                                display: "flex",
                            }}
                            data-testid="coach-input"
                        >
                            {selectedCoach}
                        </Dropdown.Toggle>
                        <DropdownMenu className={styles.create_project_dropdown}>
                            {allUsers.map((user) => (
                                <DropdownItem
                                    className={styles.create_project_dropdown_item}
                                    key={user.callName}
                                    value={user.callName}
                                    data-testid={"user-select-" + user.callName}
                                    onClick={() => setSelectedCoach(user.callName)}
                                >
                                    {user.callName}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <button
                        style={{ marginLeft: "1rem" }}
                        className="btn btn-secondary"
                        type="button"
                        onClick={handleAddCreatedCoach}
                        data-testid="add-coach-button"
                    >
                        {capitalize(t("add coach"))}
                    </button>
                </div>
            </div>
        </div>
    );
}
