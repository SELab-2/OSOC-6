import { useState } from "react";
import { ButtonGroup, Dropdown, Row } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import {Status} from "../api/entities/StudentEntity";
import {StudentStatusModal} from "./studentStatusModal";

export function StudentStatus(props: { studentUrl: string, status: Status }) {
    const [suggestionValue, setSuggestionValue] = useState(props.status);

    return (
        <>
            <Dropdown as={ButtonGroup} drop="up" title={suggestionValue} >
                <Dropdown.Toggle>{suggestionValue}</Dropdown.Toggle>
                <DropdownMenu>
                    {Object.values(Status).map(value => (
                        <DropdownItem key={value} onClick={() => setSuggestionValue(value)}>
                            {value}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
            <StudentStatusModal status={suggestionValue} studentUrl={props.studentUrl}/>
        </>
    );
}
