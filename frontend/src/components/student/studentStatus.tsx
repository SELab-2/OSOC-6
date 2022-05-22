import { useState } from "react";
import { ButtonGroup, Dropdown, Row } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import { Status } from "../../api/entities/StudentEntity";
import { StudentStatusModal } from "./studentStatusModal";

/**
 * Component to change the status of a student
 * @param props properties needed to render this component
 */
export function StudentStatus(props: { studentUrl: string; status: Status }) {
    const [suggestionValue, setSuggestionValue] = useState(props.status);

    return (
        <>
            <Row>
                <div className="col-sm">
                    <Dropdown as={ButtonGroup} drop="up" title={suggestionValue}>
                        <Dropdown.Toggle
                            style={{
                                backgroundColor: "#0a0839",
                                borderColor: "white",
                                alignItems: "center",
                                display: "flex",
                                width: 150,
                                justifyContent: "center",
                            }}
                        >
                            {suggestionValue}
                        </Dropdown.Toggle>
                        <DropdownMenu>
                            {Object.values(Status).map((value) => (
                                <DropdownItem key={value} onClick={() => setSuggestionValue(value)}>
                                    {value}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div className="col-sm">
                    <StudentStatusModal status={suggestionValue} studentUrl={props.studentUrl} />
                </div>
            </Row>
        </>
    );
}
