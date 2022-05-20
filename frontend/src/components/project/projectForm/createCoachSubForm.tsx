import { ButtonGroup, Col, Dropdown, Row } from "react-bootstrap";
import Image from "next/image";
import { capitalize } from "../../../utility/stringUtil";
import { ChangeEvent, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useSwrWithEdition } from "../../../hooks/utilHooks";
import apiPaths from "../../../properties/apiPaths";
import { getAllUsersFromPage } from "../../../api/calls/userCalls";
import { IUser } from "../../../api/entities/UserEntity";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

export interface CreateCoachSubFormProps {
    setCoachUrls: (urls: string[]) => void;
    illegalCoaches: string[];
}

export default function CreateCoachSubForm({ setCoachUrls, illegalCoaches }: CreateCoachSubFormProps) {
    const { t } = useTranslation("common");
    const { data: receivedUsers, error: usersError } = useSwrWithEdition(
        apiPaths.userByEdition,
        getAllUsersFromPage
    );
    const allUsers: IUser[] = receivedUsers || [];

    const [selectedCoach, setSelectedCoach] = useState<string>("");
    const [coaches, setCoaches] = useState<string[]>([]);

    if (usersError) {
        console.log(usersError);
        return null;
    }

    function handleAddCreatedCoach() {
        const newCoach = selectedCoach ? selectedCoach : allUsers[0].callName;

        console.log(newCoach);
        console.log(coaches);

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

    function initialize() {
        setSelectedCoach(allUsers[0].callName);
    }

    return (
        <div onLoad={initialize}>
            {coaches.map((coach: string, index: number) => (
                <Row key={index}>
                    <Col>{coach}</Col>
                    <Col xs={1}>
                        <a
                            data-testid={"remove-added-coach-" + coach}
                            onClick={() => setCoaches(coaches.filter((_, valIndex) => valIndex !== index))}
                        >
                            <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                        </a>
                    </Col>
                </Row>
            ))}

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
                    {selectedCoach ? selectedCoach : "Pick a coach"}
                </Dropdown.Toggle>
                <DropdownMenu>
                    {allUsers.map((user) => (
                        <DropdownItem
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
                className="btn btn-secondary"
                type="button"
                onClick={handleAddCreatedCoach}
                data-testid="add-coach-button"
            >
                {capitalize(t("add coach"))}
            </button>
        </div>
    );
}
