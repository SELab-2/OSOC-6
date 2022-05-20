import { Col, Row } from "react-bootstrap";
import Image from "next/image";
import { Field } from "formik";
import { capitalize } from "../../../utility/stringUtil";
import { ChangeEvent, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useSwrWithEdition } from "../../../hooks/utilHooks";
import apiPaths from "../../../properties/apiPaths";
import { getAllUsersFromPage } from "../../../api/calls/userCalls";
import { IUser } from "../../../api/entities/UserEntity";

export interface CreateCoachSubFormProps {
    setCoachUrls: (urls: string[]) => void;
}

export default function CreateCoachSubForm({ setCoachUrls }: CreateCoachSubFormProps) {
    const { t } = useTranslation("common");
    const { data: receivedUsers, error: usersError } = useSwrWithEdition(
        apiPaths.userByEdition,
        getAllUsersFromPage
    );
    const allUsers: IUser[] = receivedUsers || [];

    const [selectedCoach, setSelectedCoach] = useState<string>("");
    const [coaches, setCoaches] = useState<string[]>([]);

    function handleAddCreatedCoach() {
        const newCoach = selectedCoach ? selectedCoach : allUsers[0].callName;

        if (!selectedCoach) {
            setSelectedCoach(newCoach);
        }

        if (!coaches.includes(newCoach)) {
            setCoaches([...coaches, newCoach]);

            setCoachUrls(
                coaches.map(
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
                        <a>
                            <Image
                                onClick={() =>
                                    setCoaches(
                                        coaches.filter((_, valIndex) => valIndex !== index)
                                    )
                                }
                                alt=""
                                src={"/resources/delete.svg"}
                                width="15"
                                height="15"
                            />
                        </a>
                    </Col>
                </Row>
            ))}
            <Field
                className="form-control mb-2"
                label={capitalize(t("coach"))}
                as="select"
                name="coach"
                data-testid="coach-input"
                placeholder={capitalize(t("coach"))}
                value={selectedCoach}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedCoach(e.target.value)}
            >
                {allUsers.map((user) => (
                    <option
                        key={user.callName}
                        value={user.callName}
                        label={user.callName}
                        data-testid={"user-" + user.callName}
                    >
                        {user.callName}
                    </option>
                ))}
            </Field>
            <button
                className="btn btn-secondary"
                type="button"
                onClick={handleAddCreatedCoach}
                data-testid="add-coach-button"
            >
                {capitalize(t("add coach"))}
            </button>
        </div>
    )
}