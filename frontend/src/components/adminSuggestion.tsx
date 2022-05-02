import {SuggestionStrategy} from "../api/entities/SuggestionEntity";
import {useState} from "react";
import {Button, ButtonGroup, Dropdown, DropdownButton} from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";

export function AdminSuggestion(props: {studentUrl: string}) {
    const options = ["Undecided", SuggestionStrategy.yes, SuggestionStrategy.maybe, SuggestionStrategy.no];
    const [suggestionValue, setSuggestionValue] = useState(options[0]);

    return (
        <>
        <Dropdown as={ButtonGroup} drop="up" title={suggestionValue}>
            <Dropdown.Toggle>
                {suggestionValue}
            </Dropdown.Toggle>
            <DropdownMenu>
                {options.map((option) =>
                    (<DropdownItem key={option} onClick={() => setSuggestionValue(option)}>{option}</DropdownItem>))}
            </DropdownMenu>
        </Dropdown>
        </>
    )
}